"use client";

import { cn } from "@/lib/utils";
import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";
import React, { useEffect, useMemo, useRef } from "react";
import { HexColorPicker } from "react-colorful";
import { FieldError } from "react-hook-form";

extend([namesPlugin]);

type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
};

const CustomPicker: React.FC<{
  color: string;
  onChange: (color: string) => void;
}> = ({ color, ...rest }) => {
  const hex = useMemo(() => {
    return color?.startsWith("#") ? color : colord(color).toHex();
  }, [color]);

  return <HexColorPicker color={hex} {...rest} />;
};

export const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const [visible, setVisible] = React.useState(false);
  const [color, setColor] = React.useState(props.color);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setColor(props.color);
  }, [props.color]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-9 h-9 rounded-sm cursor-pointer border"
      style={{ backgroundColor: color }}
      onClick={() => {
        setVisible(true);
      }}
    >
      {visible && (
        <div className="absolute top-0 right-[-210px]">
          <CustomPicker
            color={props.color}
            onChange={(color: string) => {
              setColor(color);
              if (props.onChange) {
                props.onChange(color);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

interface ColorPickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError | boolean;
  color: string;
  onColorChange: (color: string) => void;
}

export const ColorPickerInput = React.forwardRef<
  HTMLInputElement,
  ColorPickerInputProps
>(({ className, error, color, onColorChange, ...props }, ref) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex cursor-pointer items-center text-gray-400">
        <ColorPicker color={color} onChange={onColorChange} />
      </div>
      <input
        type="text"
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent pl-12 pr-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus-visible:ring-destructive",
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

ColorPickerInput.displayName = "ColorPickerInput";
