import { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  width?: string | number;
  height?: string | number;
  color?: string;
  className? : string;
}

export default function CashPayIcon({
  height = "22px",
  width = "22px",
  color = "currentColor",
  className,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      stroke={color}
      {...props}
      className={className}
    >
      <g fill="none" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2 11l2.807-3.157A4 4 0 0 1 7.797 6.5H8m-6 13h5.5l4-3s.81-.547 2-1.5c2.5-2 0-5.166-2.5-3.5C8.964 12.857 7 14 7 14"
        ></path>
        <path d="M8 13.5V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6.5"></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a2 2 0 1 1 0-4a2 2 0 0 1 0 4m4.5-1.99l.01-.011m-9.01.011l.01-.011"
        ></path>
      </g>
    </svg>
  );
}
