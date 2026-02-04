export default function Button({ children, onClick, variant = "primary" }) {
    const styles = variant === "primary" 
      ? "bg-white text-black hover:bg-zinc-200" 
      : "bg-[#1c1c1e] text-zinc-400 hover:text-white hover:bg-[#2c2c2e]";
  
    return (
      <button 
        onClick={onClick}
        className={`${styles} w-full py-5 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-xl border-b-4 border-black/20`}
      >
        {children}
      </button>
    );
  }