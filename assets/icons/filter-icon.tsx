import SvgIcon, { SvgIconOwnProps } from "@mui/material/SvgIcon";

export default function FilterIcon(props?: SvgIconOwnProps) {
  return (
    <SvgIcon {...props}>
      <svg
        width="19"
        height="18"
        viewBox="0 0 19 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_5165_395"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="19"
          height="18"
        >
          <rect x="0.5" width="18" height="18" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_5165_395)">
          <path
            d="M8.69871 15.5455C8.46689 15.5455 8.27257 15.4671 8.11575 15.3103C7.95893 15.1535 7.88053 14.9591 7.88053 14.7273V9.81823L3.13507 3.76368C2.93053 3.49095 2.89984 3.20459 3.04303 2.90459C3.18621 2.60459 3.43507 2.45459 3.78962 2.45459H15.2442C15.5987 2.45459 15.8476 2.60459 15.9908 2.90459C16.1339 3.20459 16.1033 3.49095 15.8987 3.76368L11.1533 9.81823V14.7273C11.1533 14.9591 11.0748 15.1535 10.918 15.3103C10.7612 15.4671 10.5669 15.5455 10.3351 15.5455H8.69871ZM9.51689 9.2455L13.5669 4.09095H5.46689L9.51689 9.2455Z"
            fill="#292929"
          />
        </g>
      </svg>
    </SvgIcon>
  );
}
