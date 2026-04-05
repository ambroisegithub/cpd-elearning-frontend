"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Loader2, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  BookOpen,
  Award,
  Clock,
  Building2,
  Shield,
  Activity,
  Users,
  Eye,
  Download,
  X
} from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import { fetchUserDetails } from "@/lib/features/systemAdmin/userManagementSlice";

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

// Safe number formatter
const safeToFixed = (value: any, digits: number = 1): string => {
  if (value === null || value === undefined) return '0.0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0.0';
  return num.toFixed(digits);
};

// Safe rating display
const formatRating = (rating: any): string => {
  return safeToFixed(rating, 1);
};

export default function UserDetailModal({
  open,
  onClose,
  userId,
  onEdit,
  onDelete,
}: UserDetailModalProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    if (open && userId) {
      loadUserData();
    }
  }, [open, userId]);
  
  const loadUserData = async () => {
    setLoading(true);
    try {
      const result = await dispatch(fetchUserDetails(userId)).unwrap();
      setUserData(result);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SYSTEM_ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'INSTITUTION_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CONTENT_CREATOR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'INSTRUCTOR':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'LEARNER':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Loading skeleton
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto border border-gray-200">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle>Loading User Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Header Skeleton */}
            <div className="flex gap-6 p-6 bg-gray-50 rounded-lg">
              <Skeleton className="w-24 h-24 rounded-full bg-gray-200/70" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-7 w-48 bg-gray-200/70" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full bg-gray-200/70" />
                  <Skeleton className="h-6 w-16 rounded-full bg-gray-200/70" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-5 w-40 bg-gray-200/70" />
                  <Skeleton className="h-5 w-32 bg-gray-200/70" />
                </div>
              </div>
            </div>
            {/* Tabs Skeleton */}
            <Skeleton className="h-10 w-full rounded-lg bg-gray-200/70" />
            {/* Content Skeleton */}
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-32 rounded-lg bg-gray-200/70" />
              <Skeleton className="h-32 rounded-lg bg-gray-200/70" />
              <Skeleton className="h-32 rounded-lg bg-gray-200/70" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (!userData) {
    return null;
  }
  
  const { user, detailed_statistics, enrollments, courses_taught, certificates, recent_activity, sessions } = userData;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto border border-gray-200">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">User Details</DialogTitle>
              <DialogDescription className="text-sm">
                {user.first_name} {user.last_name}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onEdit} className="border-gray-200">
                <Edit className="w-4 h-4 mr-1.5" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={onDelete}>
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200">
            <div className="flex-shrink-0">
              <Avatar className="w-20 h-20 border-2 border-white shadow-md">
                <AvatarImage src={user.profile_picture_url} />
                <AvatarFallback className="text-xl">
                  {user.first_name?.[0] || ''}
                  {user.last_name?.[0] || ''}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </h2>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <Badge className={`text-xs ${getRoleColor(user.cpd_role)}`}>
                    {user.cpd_role?.replace(/_/g, ' ') || 'No Role'}
                  </Badge>
                  {user.institution_role && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {user.institution_role}
                    </Badge>
                  )}
                  {user.is_active ? (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                      Inactive
                    </Badge>
                  )}
                  {user.is_verified && (
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="font-medium truncate">{user.email}</span>
                </div>
                {user.phone_number && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{user.phone_number}</span>
                  </div>
                )}
                {(user.country || user.city) && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{[user.city, user.country].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">Joined {formatDate(user.date_joined)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-6 h-9 border border-gray-200">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs">Activity</TabsTrigger>
              <TabsTrigger value="institutions" className="text-xs">Institutions</TabsTrigger>
              <TabsTrigger value="courses" className="text-xs">Courses</TabsTrigger>
              <TabsTrigger value="sessions" className="text-xs">Sessions</TabsTrigger>
              <TabsTrigger value="audit" className="text-xs">Audit Log</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4 mt-4">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Learning</p>
                        <h3 className="text-xl font-bold mt-1">
                          {detailed_statistics?.learning?.total_courses_enrolled || 0}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Courses enrolled</p>
                      </div>
                      <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div>
                        <span className="text-gray-500">Completed:</span>
                        <span className="font-medium ml-1">
                          {detailed_statistics?.learning?.completed_courses || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">In Progress:</span>
                        <span className="font-medium ml-1">
                          {detailed_statistics?.learning?.in_progress_courses || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Hours:</span>
                        <span className="font-medium ml-1">
                          {detailed_statistics?.learning?.total_hours || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Certificates:</span>
                        <span className="font-medium ml-1">
                          {detailed_statistics?.learning?.certificates || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Teaching</p>
                        <h3 className="text-xl font-bold mt-1">
                          {detailed_statistics?.teaching?.courses_as_primary_instructor || 0}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Courses taught</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div>
                        <span className="text-gray-500">Students:</span>
                        <span className="font-medium ml-1">
                          {detailed_statistics?.teaching?.total_students_taught || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Rating:</span>
                        <span className="font-medium ml-1">
                          {formatRating(detailed_statistics?.teaching?.average_course_rating)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Reviews:</span>
                        <span className="font-medium ml-1">
                          {detailed_statistics?.teaching?.total_reviews || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Institutions</p>
                        <h3 className="text-xl font-bold mt-1">
                          {detailed_statistics?.institutions?.total_institutions || 0}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">Memberships</p>
                      </div>
                      <div className="p-2 bg-purple-50 rounded-lg border border-purple-200">
                        <Building2 className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                      <div>
                        <span className="text-gray-500">Admin:</span>
                        <span className="font-medium ml-1">
                          {detailed_statistics?.institutions?.institutions_as_admin || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Instructor:</span>
                        <span className="font-medium ml-1">
                          {detailed_statistics?.institutions?.institutions_as_instructor || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Member:</span>
                        <span className="font-medium ml-1">
                          {detailed_statistics?.institutions?.institutions_as_member || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Activity */}
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Recent Activity</h3>
                    <Button variant="ghost" size="sm" className="text-xs h-7">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {recent_activity?.slice(0, 5).map((activity: any, index: number) => (
                      <div key={index} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded-lg border border-gray-100">
                        <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-200">
                          <Activity className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!recent_activity || recent_activity.length === 0) && (
                      <p className="text-center text-gray-500 py-4 text-sm">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-4 mt-4">
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Activity Timeline</h3>
                  <div className="space-y-3">
                    {recent_activity?.map((activity: any, index: number) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                          {index < recent_activity.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200"></div>
                          )}
                        </div>
                        <div className="pb-3 flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!recent_activity || recent_activity.length === 0) && (
                      <p className="text-center text-gray-500 py-4">No activity recorded</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Institutions Tab */}
            <TabsContent value="institutions" className="space-y-4 mt-4">
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Institution Memberships</h3>
                    <Button variant="outline" size="sm" className="text-xs h-7 border-gray-200">
                      Manage
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {user.institutions?.map((institution: any) => (
                      <div key={institution.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                            <Building2 className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{institution.name}</h4>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                              <Badge className={`text-xs ${getRoleColor(institution.role)}`}>
                                {institution.role}
                              </Badge>
                              <span>Joined {formatDate(institution.joined_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {institution.is_primary && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Primary
                            </Badge>
                          )}
                          {institution.is_active ? (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!user.institutions || user.institutions.length === 0) && (
                      <p className="text-center text-gray-500 py-4 text-sm">No institution memberships</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Enrollments */}
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold">Enrollments</h3>
                      <span className="text-xs text-gray-600">
                        {enrollments?.length || 0} total
                      </span>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {enrollments?.slice(0, 5).map((enrollment: any) => (
                        <div key={enrollment.id} className="p-2.5 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium truncate">{enrollment.course?.title || 'Untitled'}</h4>
                            <Badge variant="outline" className="text-xs">{enrollment.status}</Badge>
                          </div>
                          <div className="mt-1.5 flex items-center justify-between text-xs text-gray-600">
                            <span>Enrolled {formatDate(enrollment.enrolled_at)}</span>
                            <span>{enrollment.completion_percentage || 0}% complete</span>
                          </div>
                        </div>
                      ))}
                      {(!enrollments || enrollments.length === 0) && (
                        <p className="text-center text-gray-500 py-4 text-sm">No enrollments</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Courses Taught */}
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold">Courses Taught</h3>
                      <span className="text-xs text-gray-600">
                        {courses_taught?.length || 0} total
                      </span>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {courses_taught?.slice(0, 5).map((course: any) => (
                        <div key={course.id} className="p-2.5 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium truncate">{course.title}</h4>
                            <Badge variant="outline" className="text-xs">{course.role}</Badge>
                          </div>
                          <div className="mt-1.5 grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div>
                              <span>Students:</span>
                              <span className="font-medium ml-1">{course.enrollment_count || 0}</span>
                            </div>
                            <div>
                              <span>Rating:</span>
                              <span className="font-medium ml-1">{formatRating(course.average_rating)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!courses_taught || courses_taught.length === 0) && (
                        <p className="text-center text-gray-500 py-4 text-sm">No courses taught</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Certificates */}
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Certificates Earned</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {certificates?.map((certificate: any) => (
                      <div key={certificate.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium truncate">{certificate.course_title}</h4>
                          <p className="text-xs text-gray-600">
                            Issued {formatDate(certificate.issued_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Button variant="outline" size="sm" className="h-7 text-xs border-gray-200">
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 text-xs border-gray-200">
                            <Download className="w-3.5 h-3.5 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                    {(!certificates || certificates.length === 0) && (
                      <p className="text-center text-gray-500 py-4 text-sm">No certificates earned</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Sessions Tab */}
            <TabsContent value="sessions" className="space-y-4 mt-4">
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Active Sessions</h3>
                    <Button variant="outline" size="sm" className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">
                      Terminate All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {sessions?.filter((s: any) => s.is_active).map((session: any) => (
                      <div key={session.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{session.system}</h4>
                            <p className="text-xs text-gray-600">{session.device_info}</p>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                              <span>IP: {session.ip_address}</span>
                              <span>Last active: {formatDate(session.last_active)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              Active
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600">
                              Terminate
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!sessions || sessions.filter((s: any) => s.is_active).length === 0) && (
                      <p className="text-center text-gray-500 py-4 text-sm">No active sessions</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Audit Tab */}
            <TabsContent value="audit" className="space-y-4 mt-4">
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Audit Log</h3>
                  <div className="text-center py-8">
                    <Shield className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500">Audit log functionality coming soon</p>
                    <p className="text-xs text-gray-400 mt-1">Track all changes made to this user account</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}