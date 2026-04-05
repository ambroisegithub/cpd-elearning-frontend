"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Trash2, Archive, UserX, Loader2, Users, Shield, Database } from "lucide-react";

interface UserDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  user: any;
  onConfirm: (options: any) => Promise<void> | void;
  isDeleting: boolean;
}

export default function UserDeleteDialog({
  open,
  onClose,
  user,
  onConfirm,
  isDeleting,
}: UserDeleteDialogProps) {
  const [deletionType, setDeletionType] = useState<'soft' | 'hard'>('soft');
  const [forceDelete, setForceDelete] = useState(false);
  const [reassignInstructorId, setReassignInstructorId] = useState('');
  const [archiveCourses, setArchiveCourses] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [reason, setReason] = useState('');
  
  const hasDependencies = user?.statistics?.courses_taught > 0 || 
                          user?.institutions?.some((inst: any) => inst.role === 'ADMIN');
  
  const handleConfirm = async () => {
    if (deletionType === 'hard' && confirmationText !== 'DELETE') {
      return;
    }
    
    const options: any = {
      permanent: deletionType === 'hard',
      force: forceDelete,
    };
    
    if (reassignInstructorId) {
      options.reassign_courses_to = reassignInstructorId;
    }
    
    await onConfirm(options);
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto border border-gray-200">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="text-lg text-red-600 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Delete User
          </DialogTitle>
          <DialogDescription className="text-sm">
            {user?.first_name} {user?.last_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {/* Impact Cards - Compact Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center gap-1.5 text-red-700">
                <UserX className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Account</span>
              </div>
              <p className="text-xs text-red-600 mt-0.5">
                {deletionType === 'soft' ? 'Deactivated' : 'Permanently deleted'}
              </p>
            </div>
            
            {user?.statistics?.courses_taught > 0 && (
              <div className="p-2.5 border border-amber-200 rounded-lg bg-amber-50">
                <div className="flex items-center gap-1.5 text-amber-700">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Courses</span>
                </div>
                <p className="text-xs text-amber-600 mt-0.5">
                  {user.statistics.courses_taught} affected
                </p>
              </div>
            )}
            
            {user?.institutions?.some((inst: any) => inst.role === 'ADMIN') && (
              <div className="p-2.5 border border-purple-200 rounded-lg bg-purple-50">
                <div className="flex items-center gap-1.5 text-purple-700">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Admin</span>
                </div>
                <p className="text-xs text-purple-600 mt-0.5">
                  {user.institutions.filter((inst: any) => inst.role === 'ADMIN').length} institutions
                </p>
              </div>
            )}
            
            <div className="p-2.5 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center gap-1.5 text-blue-700">
                <Database className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Data</span>
              </div>
              <p className="text-xs text-blue-600 mt-0.5">
                {deletionType === 'soft' ? 'Preserved' : 'Deleted'}
              </p>
            </div>
          </div>
          
          {/* Deletion Type Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700">Deletion Type</Label>
            <RadioGroup value={deletionType} onValueChange={(v: any) => setDeletionType(v)} className="space-y-1.5">
              <div className="flex items-start space-x-2 p-2 border border-gray-200 rounded-lg">
                <RadioGroupItem value="soft" id="soft" className="mt-0.5" />
                <Label htmlFor="soft" className="flex-1 cursor-pointer">
                  <span className="text-sm font-medium">Soft Delete</span>
                  <p className="text-xs text-gray-500">Deactivate account, preserve data</p>
                </Label>
              </div>
              
              <div className="flex items-start space-x-2 p-2 border border-gray-200 rounded-lg">
                <RadioGroupItem value="hard" id="hard" className="mt-0.5" />
                <Label htmlFor="hard" className="flex-1 cursor-pointer">
                  <span className="text-sm font-medium">Permanent Delete</span>
                  <p className="text-xs text-gray-500">Irreversible, most data removed</p>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Dependencies Handling */}
          {hasDependencies && (
            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3">
              <h5 className="text-xs font-medium text-gray-700">Dependencies</h5>
              
              {/* Courses handling */}
              {user?.statistics?.courses_taught > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Reassign Courses</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="archive_courses"
                        checked={archiveCourses}
                        onCheckedChange={setArchiveCourses}
                        className="scale-75"
                      />
                      <Label htmlFor="archive_courses" className="text-xs">Archive instead</Label>
                    </div>
                  </div>
                  {!archiveCourses && (
                    <Select value={reassignInstructorId} onValueChange={setReassignInstructorId}>
                      <SelectTrigger className="h-8 text-xs border-gray-200">
                        <SelectValue placeholder="Select instructor..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instr-1">John Doe</SelectItem>
                        <SelectItem value="instr-2">Jane Smith</SelectItem>
                        <SelectItem value="instr-3">Robert Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
              
              {/* Force delete */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                <div>
                  <Label htmlFor="force_delete" className="text-xs">Force Delete</Label>
                  <p className="text-[10px] text-gray-500">Skip dependency checks</p>
                </div>
                <Switch
                  id="force_delete"
                  checked={forceDelete}
                  onCheckedChange={setForceDelete}
                  className="scale-75"
                />
              </div>
            </div>
          )}
          
          {/* Reason */}
          <div className="space-y-1.5">
            <Label className="text-xs">Reason (Optional)</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for deletion..."
              rows={2}
              className="text-sm resize-none border-gray-200"
            />
          </div>
          
          {/* Confirmation for hard delete */}
          {deletionType === 'hard' && (
            <div className="space-y-1.5">
              <Label className="text-xs">
                Type <span className="font-mono text-red-600 bg-red-50 px-1 py-0.5 rounded">DELETE</span> to confirm
              </Label>
              <Input
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="DELETE"
                className={`h-8 text-sm ${confirmationText === 'DELETE' ? 'border-green-500' : 'border-red-300'}`}
              />
            </div>
          )}
          
          {/* Warning */}
          <Alert variant="destructive" className="py-2 border-red-200 bg-red-50">
            <AlertCircle className="w-3.5 h-3.5" />
            <AlertDescription className="text-xs">
              This action cannot be undone. Review dependencies before proceeding.
            </AlertDescription>
          </Alert>
          
          {/* Acknowledgment */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="understand"
              className="mt-0.5 rounded border-gray-300"
            />
            <Label htmlFor="understand" className="text-xs text-gray-600">
              I understand this action is irreversible and I have authorization.
            </Label>
          </div>
        </div>
        
        <DialogFooter className="border-t border-gray-200 pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose} 
            disabled={isDeleting} 
            className="border-gray-200"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            disabled={
              isDeleting || 
              (deletionType === 'hard' && confirmationText !== 'DELETE')
            }
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-white" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                {deletionType === 'soft' ? 'Deactivate' : 'Delete'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}