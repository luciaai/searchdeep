import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface DownloadSearchButtonProps {
  messages: any[];
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function DownloadSearchButton({
  messages,
  variant = 'outline',
  size = 'sm',
  className = '',
}: DownloadSearchButtonProps) {
  const handleDownloadClick = () => {
    try {
      // Format the conversation for downloading
      const formattedText = messages.map(message => {
        const role = message.role === 'user' ? 'You' : 'Assistant';
        return `${role}: ${message.content}`;
      }).join('\n\n');
      
      // Create a blob with the text content
      const blob = new Blob([formattedText], { type: 'text/plain' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      
      // Generate a filename with the current date and time
      const date = new Date();
      const formattedDate = date.toISOString().replace(/[:.]/g, '-').slice(0, 19);
      a.download = `search-${formattedDate}.txt`;
      
      // Trigger the download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Search downloaded as text file');
    } catch (error) {
      console.error('Failed to download search:', error);
      toast.error('Failed to download search');
    }
  };

  return (
    <Button
      onClick={handleDownloadClick}
      variant={variant}
      size={size}
      className={`gap-1 ${className}`}
      title="Download search as text file"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Download</span>
    </Button>
  );
}
