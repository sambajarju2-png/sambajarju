import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';

export async function SanityVisualEditing() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return <VisualEditing />;
}
