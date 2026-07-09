import { useRef } from "react";
import { useNoteFabStore } from "../store/noteFabStore";

export default function NoteFab() {
  const { notes, isOpen, position, toggleOpen, addNote, removeNote, setPosition } =
    useNoteFabStore();
  const dragRef = useRef({ dragging: false, offsetX: 0, offsetY: 0 });
  const inputRef = useRef(null);

  const handleMouseDown = (e) => {
    dragRef.current = {
      dragging: true,
      offsetX: e.clientX - position.x,
      offsetY: e.clientY - position.y,
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!dragRef.current.dragging) return;
    setPosition({
      x: e.clientX - dragRef.current.offsetX,
      y: e.clientY - dragRef.current.offsetY,
    });
  };

  const handleMouseUp = () => {
    dragRef.current.dragging = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleAddNote = () => {
    const text = inputRef.current?.value?.trim();
    if (text) {
      addNote(text);
      inputRef.current.value = "";
    }
  };

  return (
    <div
      className="fixed z-50 flex flex-col items-start"
      style={{ left: position.x, bottom: position.y }}
    >
      <button
        className="relative w-12 h-12 rounded-full bg-brand-500 text-white text-xl shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onClick={toggleOpen}
      >
        📝
        {notes.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {notes.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="mt-2 w-60 bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex justify-between text-xs py-1 border-b border-gray-100"
              >
                <span>{note.text}</span>
                <button
                  className="text-gray-400 hover:text-red-600"
                  onClick={() => removeNote(note.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 mt-2">
            <input
              ref={inputRef}
              type="text"
              placeholder="Tambah catatan..."
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs"
            />
            <button
              onClick={handleAddNote}
              className="text-xs bg-brand-500 text-white px-2 py-1 rounded"
            >
              Tambah
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
