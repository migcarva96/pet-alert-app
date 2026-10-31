import {
  FileIcon as GenericFileIcon,
  FilePdfIcon,
  ImageIcon,
  VideoIcon,
} from 'phosphor-react-native';

import { Colors } from '@/constants/theme';

export function FileIcon({ mimeType, size = 24 }: { mimeType: string; size?: number }) {
  const props = { size, color: Colors.accentBase };
  if (mimeType.startsWith('image/')) return <ImageIcon {...props} />;
  if (mimeType.startsWith('video/')) return <VideoIcon {...props} />;
  if (mimeType === 'application/pdf') return <FilePdfIcon {...props} />;
  return <GenericFileIcon {...props} />;
}
