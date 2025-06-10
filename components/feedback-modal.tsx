"use client";

// This is a temporary placeholder for the feedback modal
// It's simplified to avoid build issues with missing dependencies
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Minimal placeholder implementation that will build successfully
export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            We'd love to hear your thoughts! This feature is currently under maintenance.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
