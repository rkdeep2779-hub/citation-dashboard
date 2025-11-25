import * as React from "react";

export const Input = React.forwardRef(function Input(
  { className, type, ...props },
  ref
) {
  return (
    <input
      type={type}
      className={
        "flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus:ring-2 focus:ring-zinc-900 " +
        (className || "")
      }
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
