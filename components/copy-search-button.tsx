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
      // Create both plain text and HTML versions for rich text copying
      const plainText = messages.map(message => {
        const role = message.role === 'user' ? 'You' : 'Assistant';
        return `${role}: ${message.content}`;
      }).join('\n\n');
      
      // Create HTML version with styling
      const htmlContent = messages.map(message => {
        const role = message.role === 'user' ? 'You' : 'Assistant';
        const roleStyle = message.role === 'user' 
          ? 'color: #6366F1; font-weight: bold;' // Indigo for user
          : 'color: #8B5CF6; font-weight: bold;'; // Purple for assistant
        
        // Process content to preserve line breaks
        const formattedContent = message.content
          .replace(/\n/g, '<br>')
          .replace(/```([\s\S]*?)```/g, '<pre style="background-color: #f1f5f9; padding: 1rem; border-radius: 0.375rem; overflow-x: auto;">$1</pre>');
          
        return `<div style="margin-bottom: 1rem;">
          <span style="${roleStyle}">${role}:</span> 
          <span>${formattedContent}</span>
        </div>`;
      }).join('');
      
      // Wrap in a container with some basic styling
      const fullHtml = `<div style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.5;">${htmlContent}</div>`;
      
      // Use the Clipboard API to write both formats
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([plainText], { type: 'text/plain' }),
          'text/html': new Blob([fullHtml], { type: 'text/html' })
        })
      ]);
      
      setIsCopied(true);
      toast.success('Search copied to clipboard with formatting');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy search:', error);
      
      // Fallback to plain text if rich copy fails
      try {
        const plainText = messages.map(message => {
          const role = message.role === 'user' ? 'You' : 'Assistant';
          return `${role}: ${message.content}`;
        }).join('\n\n');
        
        await navigator.clipboard.writeText(plainText);
        setIsCopied(true);
        toast.success('Search copied to clipboard (plain text only)');
        
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      } catch (fallbackError) {
        console.error('Fallback copy also failed:', fallbackError);
        toast.error('Failed to copy search to clipboard');
      }
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
