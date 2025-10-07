import React, { useState, useEffect } from 'react';
import { Modal, Button, Spin, message } from 'antd';
import { downloadFile } from '../utils/fileViewerHelper';
import { 
  DownloadOutlined, 
  CloseOutlined, 
  FileTextOutlined,
  PlayCircleOutlined,
  PictureOutlined,
  FileOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  RotateLeftOutlined,
  RotateRightOutlined
} from '@ant-design/icons';

const FileViewer = ({ 
  visible, 
  onClose, 
  fileUrl, 
  fileName = '', 
  title = 'File Viewer' 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  // Reset state when modal opens/closes or file changes
  useEffect(() => {
    if (visible && fileUrl) {
      setLoading(true);
      setError(null);
      setZoom(100);
      setRotation(0);
      detectFileType(fileUrl, fileName);
    }
  }, [visible, fileUrl, fileName]);

  const detectFileType = (url, name) => {
    if (!url) {
      setError('No file URL provided');
      setLoading(false);
      return;
    }

    // Determine file type from URL or filename
    const fileNameLower = (name || url).toLowerCase();
    
    if (fileNameLower.includes('.pdf') || url.includes('.pdf')) {
      setFileType('pdf');
    } else if (fileNameLower.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)$/)) {
      setFileType('image');
    } else if (fileNameLower.match(/\.(mp4|webm|ogg|avi|mov)$/)) {
      setFileType('video');
    } else if (fileNameLower.match(/\.(mp3|wav|ogg|aac|flac)$/)) {
      setFileType('audio');
    } else if (fileNameLower.match(/\.(doc|docx)$/)) {
      setFileType('word');
    } else if (fileNameLower.match(/\.(xls|xlsx)$/)) {
      setFileType('excel');
    } else if (fileNameLower.match(/\.(txt|rtf)$/)) {
      setFileType('text');
    } else {
      setFileType('unknown');
    }
    
    setLoading(false);
  };

  const handleDownload = async () => {
    try {
      message.loading('Starting download...', 1);
      await downloadFile(fileUrl, fileName || 'download');
      message.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      message.error('Failed to download file');
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 90);
  };

  const renderFileContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <Spin size="large" />
          <span className="ml-3">Loading file...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
          <FileOutlined className="text-4xl mb-4" />
          <p>{error}</p>
        </div>
      );
    }

    switch (fileType) {
      case 'pdf':
        return (
          <div className="w-full h-full">
            <iframe
              src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full border-0"
              style={{ height: '80vh', minHeight: '600px' }}
              title={fileName || 'PDF Document'}
              onLoad={() => setLoading(false)}
              onError={() => {
                setError('Failed to load PDF. The file might be corrupted or unavailable.');
                setLoading(false);
              }}
            />
          </div>
        );

      case 'image':
        return (
          <div className="flex items-center justify-center p-4" style={{ minHeight: '400px' }}>
            <img
              src={fileUrl}
              alt={fileName || 'Image'}
              className="max-w-full max-h-full object-contain border border-gray-200 rounded"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease'
              }}
              onLoad={() => setLoading(false)}
              onError={() => {
                setError('Failed to load image. The file might be corrupted or unavailable.');
                setLoading(false);
              }}
            />
          </div>
        );

      case 'video':
        return (
          <div className="flex items-center justify-center p-4">
            <video
              src={fileUrl}
              controls
              className="max-w-full max-h-full border border-gray-200 rounded"
              style={{ maxHeight: '70vh' }}
              onLoadedData={() => setLoading(false)}
              onError={() => {
                setError('Failed to load video. The file format might not be supported.');
                setLoading(false);
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case 'audio':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <PlayCircleOutlined className="text-6xl text-blue-500 mb-4" />
            <audio
              src={fileUrl}
              controls
              className="w-full max-w-md"
              onLoadedData={() => setLoading(false)}
              onError={() => {
                setError('Failed to load audio. The file format might not be supported.');
                setLoading(false);
              }}
            >
              Your browser does not support the audio tag.
            </audio>
            <p className="mt-4 text-gray-600 text-center">{fileName || 'Audio File'}</p>
          </div>
        );

      case 'word':
        return (
          <div className="w-full h-full">
            <iframe
              src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`}
              className="w-full border-0"
              style={{ height: '80vh', minHeight: '600px' }}
              title={fileName || 'Word Document'}
              onLoad={() => setLoading(false)}
              onError={() => {
                setError('Failed to load Word document. You can download it instead.');
                setLoading(false);
              }}
            />
            <div className="p-2 text-center text-xs text-gray-500 bg-gray-50">
              If the document doesn't load, you can <button onClick={handleDownload} className="text-blue-600 underline hover:text-blue-800">download it here</button>
            </div>
          </div>
        );

      case 'excel':
        return (
          <div className="w-full h-full">
            <iframe
              src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`}
              className="w-full border-0"
              style={{ height: '80vh', minHeight: '600px' }}
              title={fileName || 'Excel Document'}
              onLoad={() => setLoading(false)}
              onError={() => {
                setError('Failed to load Excel document. You can download it instead.');
                setLoading(false);
              }}
            />
            <div className="p-2 text-center text-xs text-gray-500 bg-gray-50">
              If the document doesn't load, you can <button onClick={handleDownload} className="text-blue-600 underline hover:text-blue-800">download it here</button>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="p-4">
            <iframe
              src={fileUrl}
              className="w-full border border-gray-200 rounded"
              style={{ height: '70vh', minHeight: '400px' }}
              title={fileName || 'Text Document'}
              onLoad={() => setLoading(false)}
              onError={() => {
                setError('Failed to load text file.');
                setLoading(false);
              }}
            />
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500">
            <FileOutlined className="text-6xl mb-4" />
            <p className="text-lg font-medium mb-2">{fileName || 'Unknown File'}</p>
            <p className="text-sm mb-4">This file type cannot be previewed.</p>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={handleDownload}
            >
              Download File
            </Button>
          </div>
        );
    }
  };

  const renderToolbar = () => {
    const showImageControls = fileType === 'image';
    
    return (
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          {fileType === 'pdf' && <FileTextOutlined className="text-red-500" />}
          {fileType === 'image' && <PictureOutlined className="text-green-500" />}
          {fileType === 'video' && <PlayCircleOutlined className="text-blue-500" />}
          {fileType === 'audio' && <PlayCircleOutlined className="text-purple-500" />}
          {!['pdf', 'image', 'video', 'audio'].includes(fileType) && <FileOutlined className="text-gray-500" />}
          
          <div>
            <div className="font-medium text-gray-900 truncate max-w-xs">
              {title}
            </div>
            {fileName && (
              <div className="text-xs text-gray-500 truncate max-w-xs">
                {fileName}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {showImageControls && (
            <>
              <Button
                size="small"
                icon={<ZoomOutOutlined />}
                onClick={handleZoomOut}
                disabled={zoom <= 25}
                title="Zoom Out"
              />
              <span className="text-xs text-gray-500 px-2">{zoom}%</span>
              <Button
                size="small"
                icon={<ZoomInOutlined />}
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                title="Zoom In"
              />
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <Button
                size="small"
                icon={<RotateLeftOutlined />}
                onClick={handleRotateLeft}
                title="Rotate Left"
              />
              <Button
                size="small"
                icon={<RotateRightOutlined />}
                onClick={handleRotateRight}
                title="Rotate Right"
              />
              <div className="w-px h-4 bg-gray-300 mx-1" />
            </>
          )}
          
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            title="Download"
          >
            Download
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width="90vw"
      style={{ maxWidth: '1200px', top: 20 }}
      bodyStyle={{ padding: 0 }}
      className="file-viewer-modal"
      destroyOnClose
    >
      {renderToolbar()}
      <div className="relative">
        {renderFileContent()}
      </div>
      
      <style jsx>{`
        .file-viewer-modal .ant-modal-content {
          height: 90vh;
          display: flex;
          flex-direction: column;
        }
        
        .file-viewer-modal .ant-modal-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .file-viewer-modal .ant-modal-content {
            height: 95vh;
            margin: 10px;
          }
        }
      `}</style>
    </Modal>
  );
};

export default FileViewer;
