import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CopySearchButtonProps {
  messages: any[];
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function CopySearchButton({
  messages,
  variant = 'outline',
  size = 'sm',
  className = '',
}: CopySearchButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      // Format the conversation for copying
      const formattedText = messages.map(message => {
        const role = message.role === 'user' ? 'You' : 'Assistant';
        return `${role}: ${message.content}`;
      }).join('\n\n');
      
      await navigator.clipboard.writeText(formattedText);
      
      setIsCopied(true);
      toast.success('Search copied to clipboard');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy search:', error);
      toast.error('Failed to copy search to clipboard');
    }
  };

  return (
    <Button
      onClick={handleCopyClick}
      variant={variant}
      size={size}
      className={`gap-1 ${className}`}
      title="Copy search to clipboard"
    >
      {isCopied ? (
        <>
          <Check className="h-4 w-4" />
          <span className="hidden sm:inline">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span className="hidden sm:inline">Copy</span>
        </>
      )}
    </Button>
  );
}
