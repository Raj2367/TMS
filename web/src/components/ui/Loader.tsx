"use client";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
}

export default function Loader({ size = "md" }: LoaderProps) {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-4",
  };

  return (
    <div className="flex justify-center items-center py-6">
      <div
        className={`${sizeMap[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}
