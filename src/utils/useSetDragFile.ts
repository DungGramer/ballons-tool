import { MutableRefObject, useEffect } from 'react';

export default function useSetDragFile(
  dragBox: MutableRefObject<any>,
  addFiles: (files: Array<File>) => void
) {
  useEffect(() => {
    if (!dragBox.current) return;
    const dragBoxEl = dragBox.current;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      dragBoxEl.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
      dragBoxEl.addEventListener(eventName, () => {
        dragBoxEl.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      dragBoxEl.addEventListener(eventName, () => {
        dragBoxEl.classList.remove('dragover');
      });
    });

    dragBoxEl.addEventListener('drop', (e) => {
      addFiles([...e.dataTransfer.files]);
    });
  }, []);
}
