import React, { useRef } from 'react';
import { Download, Send, FileText, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const ResumeDownload = ({ 
  resumeRef, 
  fileName = 'resume',
  showApplyButton = true,
  onApplyClick = null 
}) => {
  const [downloading, setDownloading] = React.useState(false);

  const downloadAsPDF = async () => {
    if (!resumeRef || !resumeRef.current) {
      toast.error('Resume content not available');
      return;
    }

    setDownloading(true);
    try {
      // Clone the resume element to avoid affecting the original
      const element = resumeRef.current;
      
      // Capture as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions for A4 size
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      // Download
      pdf.save(`${fileName}.pdf`);
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download resume');
    } finally {
      setDownloading(false);
    }
  };

  const downloadAsImage = async () => {
    if (!resumeRef || !resumeRef.current) {
      toast.error('Resume content not available');
      return;
    }

    setDownloading(true);
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.png`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Resume downloaded as image!');
      });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download resume');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Download PDF Button */}
      <button
        onClick={downloadAsPDF}
        disabled={downloading}
        className="btn-primary flex items-center space-x-2"
      >
        {downloading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Download PDF</span>
          </>
        )}
      </button>

      {/* Download Image Button */}
      <button
        onClick={downloadAsImage}
        disabled={downloading}
        className="btn-outline flex items-center space-x-2"
      >
        <FileText className="w-5 h-5" />
        <span>Download as Image</span>
      </button>

      {/* Apply to Job Button */}
      {showApplyButton && onApplyClick && (
        <button
          onClick={onApplyClick}
          className="btn-secondary flex items-center space-x-2"
        >
          <Send className="w-5 h-5" />
          <span>Apply to Job</span>
        </button>
      )}
    </div>
  );
};

export default ResumeDownload;
