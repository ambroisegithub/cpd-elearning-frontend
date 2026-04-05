"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Award, Download, Eye, CheckCircle, X, AlertCircle, Lock, Loader2, BookOpen, Star } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"
import Cookies from "js-cookie"
import { Certificate } from "@/components/learning/certificate"

interface CourseCompletionProps {
  courseId: string
  courseTitle: string
  progressData: any
  allSteps: any[]
  getStepScore: (stepId: string) => number | undefined
  course: any
  // allStepsCompleted is the STRICT per-step validation from areAllStepsTrulyPassed()
  // in use-learning-progress. NEVER derived from enrollmentStatus or overallProgress.
  allStepsCompleted: boolean
}

export default function CourseCompletion({
  courseId,
  courseTitle,
  progressData,
  allSteps,
  getStepScore,
  course,
  allStepsCompleted,
}: CourseCompletionProps) {
  const [stats, setStats] = useState({
    totalScore: 0,
    totalMarks: 0,
    percentage: 0,
    completedLessons: 0,
    totalLessons: 0,
    completedAssessments: 0,
    totalAssessments: 0,
    timeSpent: 0,
  })
  const [showCertificate, setShowCertificate] = useState(false)
  const [certificateData, setCertificateData] = useState<any>(null)
  const [loadingCertificate, setLoadingCertificate] = useState(false)
  const [existingCertificate, setExistingCertificate] = useState<any>(null)
  const [checkingCertificate, setCheckingCertificate] = useState(false)

  const { token, user } = useAuth()

  const isCourseCompleted = allStepsCompleted

  useEffect(() => {
    calculateStats()
  }, [progressData, allSteps])

  useEffect(() => {
    if (isCourseCompleted && (token || Cookies.get("cpd_token")) && user) {
      checkExistingCertificate()
    }
  }, [isCourseCompleted, token, user, courseId])

  const buildCertificateData = (certRecord: any, scoreOverride?: number) => {
    const instructorObj = certRecord.course?.instructor || course?.instructor
    const institutionObj = certRecord.course?.institution || course?.institution

    return {
      studentName: certRecord.user
        ? `${certRecord.user.first_name || certRecord.user.name || ""} ${certRecord.user.last_name || ""}`.trim()
        : user
        ? `${user.first_name} ${user.last_name}`
        : "Student",
      courseName: certRecord.course?.title || courseTitle,
      score: certRecord.final_score ?? scoreOverride ?? stats.totalScore ?? stats.percentage,
      instructorName: instructorObj
        ? `${instructorObj.first_name} ${instructorObj.last_name}`
        : "Course Instructor",
      institutionName: institutionObj?.name || "CPD eLearning Platform",
      directorName: institutionObj?.director || "Platform Director",
      completionDate: certRecord.issue_date || new Date().toISOString(),
      verificationCode: certRecord.verification_code,
      certificateNumber: certRecord.certificate_number,
      certificateId: certRecord.id,
      instructorSignature: instructorObj?.signature_url ?? undefined,
      directorSignature: institutionObj?.director_signature_url ?? undefined,
      organizationStamp: institutionObj?.stamp_url ?? course?.organization_stamp ?? undefined,
    }
  }

  const checkExistingCertificate = async () => {
    setCheckingCertificate(true)
    const cookieToken = Cookies.get("cpd_token")
    const currentToken = token || cookieToken
    if (!currentToken || !user) { setCheckingCertificate(false); return }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificates/check/user/${user.id}/course/${courseId}`,
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${currentToken}` } },
      )
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.exists && result.data) {
          setExistingCertificate(result.data)
          setCertificateData(buildCertificateData(result.data))
        } else {
          setExistingCertificate(null)
        }
      } else if (response.status === 404) {
        setExistingCertificate(null)
      }
    } catch (error) {
      // silent — locked/unlocked state still drives UI
    } finally {
      setCheckingCertificate(false)
    }
  }

  const calculateStats = () => {
    if (!progressData) return

    const backendFinalScore = progressData.finalScore || progressData.overallProgress || 0

    let actualTimeSpentMinutes = progressData.totalTimeSpentMinutes || 0
    if (actualTimeSpentMinutes === 0 && progressData.completedSteps) {
      const totalSeconds = progressData.completedSteps.reduce(
        (total: number, step: any) => total + (step.time_spent_seconds || 0), 0,
      )
      actualTimeSpentMinutes = Math.ceil(totalSeconds / 60)
    }

    const completedAssessments =
      progressData.completedSteps?.filter(
        (step: any) =>
          step.type === "assessment" &&
          step.isCompleted === true &&
          (step.status === "passed" || step.passed === true),
      ).length || 0

    const totalAssessments = allSteps.filter((step) => step.type === "assessment").length

    let totalScore = 0
    let scoredAssessments = 0
    if (progressData.completedSteps) {
      progressData.completedSteps.forEach((step: any) => {
        if (
          step.type === "assessment" &&
          step.isCompleted === true &&
          step.score != null
        ) {
          totalScore += step.score
          scoredAssessments++
        }
      })
    }
    const averageScore = scoredAssessments > 0 ? Math.round(totalScore / scoredAssessments) : 0

    const completedLessons =
      progressData.completedLessons ||
      progressData.completedSteps?.filter(
        (step: any) => step.type === "lesson" && step.isCompleted,
      ).length || 0

    const totalLessons =
      progressData.totalLessons ||
      allSteps.filter((step) => step.type !== "assessment").length

    setStats({
      totalScore: averageScore,
      totalMarks: 100,
      percentage: backendFinalScore,
      completedLessons,
      totalLessons,
      completedAssessments,
      totalAssessments,
      timeSpent: actualTimeSpentMinutes,
    })
  }

  // Actual score shown in the hero — prefer the real average from assessment
  // results so learners who don't max out every quiz still see a truthful %.
  const displayScore = useMemo(() => {
    if (stats.totalScore > 0) return stats.totalScore
    if (progressData?.finalScore) return progressData.finalScore
    return stats.percentage || 0
  }, [stats.totalScore, stats.percentage, progressData?.finalScore])

  const stepStatus = useMemo(() => {
    const isStepPassed = (s: any): boolean => {
      if (!progressData?.completedSteps) return false
      const id = s.id || ""
      if (id.endsWith("-lesson")) {
        const lessonId = id.slice(0, -"-lesson".length)
        return progressData.completedSteps.some(
          (cs: any) =>
            cs.type === "lesson" &&
            String(cs.lessonId) === String(lessonId) &&
            cs.isCompleted === true,
        )
      }
      if (id.endsWith("-final-assessment")) {
        return progressData.completedSteps.some(
          (cs: any) =>
            cs.type === "assessment" &&
            (cs.lessonId === null || cs.lessonId === undefined || cs.lessonId === "") &&
            cs.isCompleted === true &&
            (cs.status === "passed" || cs.passed === true),
        )
      }
      let assessmentId = ""
      if (id.includes("-assessment-")) {
        assessmentId = id.slice(id.indexOf("-assessment-") + "-assessment-".length)
      } else if (id.includes("-quiz-")) {
        assessmentId = id.slice(id.indexOf("-quiz-") + "-quiz-".length)
      }
      if (!assessmentId) return false
      return progressData.completedSteps.some(
        (cs: any) =>
          cs.type === "assessment" &&
          String(cs.assessmentId) === String(assessmentId) &&
          cs.isCompleted === true &&
          (cs.status === "passed" || cs.passed === true),
      )
    }
    const passed = allSteps.filter(isStepPassed)
    const pending = allSteps.filter((s) => !isStepPassed(s))
    return { passedCount: passed.length, pending }
  }, [allSteps, progressData])

  const handleGenerateCertificate = async () => {
    const cookieToken = Cookies.get("cpd_token")
    const currentToken = token || cookieToken
    if (!currentToken || !user) {
      toast({ title: "Authentication Required", description: "Please log in to generate your certificate.", variant: "destructive" })
      return
    }

    setLoadingCertificate(true)
    try {
      const finalScore = displayScore

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/certificates/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${currentToken}` },
        body: JSON.stringify({ course_id: courseId, final_score: finalScore }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        const certData = result.data
        setExistingCertificate(certData)
        setCertificateData(buildCertificateData(certData, finalScore))
        setShowCertificate(true)
        toast({ title: "Certificate Generated!", description: "Your certificate has been successfully generated." })
      } else {
        throw new Error(result.message || "Failed to generate certificate")
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to generate certificate. Please try again.", variant: "destructive" })
    } finally {
      setLoadingCertificate(false)
    }
  }

  const handleViewCertificate = () => {
    if (existingCertificate && certificateData) setShowCertificate(true)
  }

  const handleDownloadCertificate = async () => {
    if (!existingCertificate?.id) return
    const cookieToken = Cookies.get("cpd_token")
    const currentToken = token || cookieToken
    if (!currentToken) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificates/${existingCertificate.id}/pdf`,
        { headers: { Authorization: `Bearer ${currentToken}` } },
      )
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data?.pdf_url) window.open(result.data.pdf_url, "_blank")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to download certificate. Please try again.", variant: "destructive" })
    }
  }

  const totalSteps = allSteps.length || 1
  const progressPct = Math.round((stepStatus.passedCount / totalSteps) * 100)

  return (
    <>
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-3">
        {/* Hero */}
        <Card className="overflow-hidden">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-center gap-4">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  isCourseCompleted ? "bg-yellow-100" : "bg-amber-100"
                }`}
              >
                {isCourseCompleted ? (
                  <Trophy className="w-6 h-6 text-yellow-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg md:text-xl font-semibold leading-tight">
                  {isCourseCompleted ? "Congratulations!" : "Course In Progress"}
                </h2>
                <p className="text-sm text-muted-foreground truncate">{courseTitle}</p>
              </div>
              <div className="text-right">
                <div
                  className={`text-2xl md:text-3xl font-bold ${
                    isCourseCompleted ? "text-green-600" : "text-amber-600"
                  }`}
                >
                  {displayScore}%
                </div>
                <p className="text-[11px] text-muted-foreground -mt-0.5">Your score</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>
                  {stepStatus.passedCount} of {totalSteps} steps passed
                </span>
                <span>{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Stat chips */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2 p-2.5 bg-muted/40 rounded-md">
            <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-none">
                {stats.completedLessons}/{stats.totalLessons}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Lessons</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-muted/40 rounded-md">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-none">
                {stats.completedAssessments}/{stats.totalAssessments}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Assessments</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-muted/40 rounded-md">
            <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-none">{stats.totalScore}%</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Avg. score</div>
            </div>
          </div>
        </div>

        {/* Certificate section */}
        <Card
          className={
            isCourseCompleted
              ? "border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10"
              : "border-amber-200 bg-amber-50/60 dark:bg-amber-950/20"
          }
        >
          <CardContent className="p-4 md:p-5">
            {isCourseCompleted ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Award className="w-9 h-9 text-primary flex-shrink-0" />
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h3 className="font-semibold text-sm md:text-base">Certificate of Completion</h3>
                  <p className="text-xs text-muted-foreground">
                    {existingCertificate
                      ? "Ready — view or download your certificate."
                      : "You've earned a certificate. Generate it below."}
                  </p>
                  {existingCertificate && (
                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate">
                      {existingCertificate.certificate_number} ·{" "}
                      {new Date(existingCertificate.issue_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                  {checkingCertificate ? (
                    <Button size="sm" disabled>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Checking
                    </Button>
                  ) : existingCertificate ? (
                    <>
                      <Button
                        size="sm"
                        onClick={handleViewCertificate}
                        className="bg-[#0158B7] hover:bg-[#014A9C]"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleDownloadCertificate}>
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        PDF
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleGenerateCertificate}
                      disabled={loadingCertificate}
                      className="bg-[#0158B7] hover:bg-[#014A9C]"
                    >
                      {loadingCertificate ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                          Generating
                        </>
                      ) : (
                        <>
                          <Award className="w-3.5 h-3.5 mr-1.5" />
                          Generate
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-amber-800 dark:text-amber-200">
                    Certificate locked
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                    Pass all lessons and assessments to unlock.
                  </p>
                  {stepStatus.pending.length > 0 && (
                    <ul className="text-xs text-amber-700 dark:text-amber-300 mt-2 space-y-0.5 list-disc list-inside">
                      {stepStatus.pending.slice(0, 3).map((s: any, i: number) => (
                        <li key={i} className="truncate">
                          {s.title}
                        </li>
                      ))}
                      {stepStatus.pending.length > 3 && (
                        <li className="list-none text-[11px] opacity-80">
                          +{stepStatus.pending.length - 3} more
                        </li>
                      )}
                    </ul>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 h-7 text-xs"
                    onClick={() => window.history.back()}
                  >
                    Go back to finish
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer actions */}
        <div className="flex gap-2 justify-center flex-wrap pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Dashboard
          </Button>
          <Button
            size="sm"
            onClick={() => (window.location.href = `/courses/${courseId}`)}
          >
            Course Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/courses")}
          >
            Browse Courses
          </Button>
        </div>
      </div>

      {/* Full-screen certificate modal */}
      {showCertificate && certificateData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-auto">
          <div className="min-h-screen p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Certificate of Completion</h2>
                  <p className="text-gray-300 text-sm mt-1">{courseTitle}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowCertificate(false)}
                  className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                  Close
                </Button>
              </div>

              <Certificate
                studentName={certificateData.studentName}
                courseName={certificateData.courseName}
                score={certificateData.score}
                instructorName={certificateData.instructorName}
                institutionName={certificateData.institutionName}
                directorName={certificateData.directorName}
                completionDate={certificateData.completionDate}
                verificationCode={certificateData.verificationCode}
                instructorSignature={certificateData.instructorSignature}
                directorSignature={certificateData.directorSignature}
                organizationStamp={certificateData.organizationStamp}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
