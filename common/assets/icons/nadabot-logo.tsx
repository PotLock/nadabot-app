import { Stack } from "@mui/material";
import Image from "next/image";

import useBreakPoints from "@nadabot/common/ui/utils/useBreakPoints";

import nadabotIcon from "../images/nadabot-icon.png";

const NadabotLogo = () => {
  const { maxWidth600, maxWidth430 } = useBreakPoints();

  return (
    <Stack direction="row" alignItems="center">
      <Image
        src={nadabotIcon.src}
        priority={true}
        width={50}
        height={50}
        alt="Nada.Bot"
        style={{ marginRight: maxWidth430 ? "0px" : "8px" }}
      />
      {!maxWidth600 && (
        <svg
          width="132"
          height="55"
          viewBox="0 0 132 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.78 25.51C0.58 24.87 0.43 24.11 0.33 23.23C0.25 22.35 0.23 21.47 0.27 20.59C0.31 19.71 0.41 18.98 0.57 18.4C1.03 18.28 1.45 17.97 1.83 17.47C2.21 16.95 2.4 16.09 2.4 14.89C2.4 13.87 2.29 13.08 2.07 12.52C1.87 11.94 1.64 11.53 1.38 11.29C1.12 11.05 0.89 10.92 0.69 10.9C0.49 10.24 0.35 9.46 0.27 8.56C0.21 7.64 0.22 6.73 0.3 5.83C0.4 4.93 0.57 4.19 0.81 3.61C1.75 3.73 2.81 3.83 3.99 3.91C5.17 3.97 6.38 4 7.62 4C8.86 4 10.08 3.99 11.28 3.97C12.48 3.93 13.47 3.89 14.25 3.85C13.99 4.13 13.71 4.61 13.41 5.29C13.13 5.95 12.9 6.65 12.72 7.39C12.56 8.13 12.51 8.78 12.57 9.34C13.11 7.56 14.14 6.13 15.66 5.05C17.18 3.95 19.25 3.4 21.87 3.4C23.01 3.4 23.98 3.5 24.78 3.7C25.6 3.88 26.27 4.22 26.79 4.72C27.33 5.22 27.75 5.95 28.05 6.91C28.33 7.73 28.46 8.57 28.44 9.43C28.42 10.27 28.36 11.12 28.26 11.98C28.16 12.82 28.11 13.66 28.11 14.5C28.11 15.42 28.2 16.15 28.38 16.69C28.56 17.21 28.79 17.6 29.07 17.86C29.37 18.12 29.66 18.3 29.94 18.4C30.12 18.98 30.22 19.71 30.24 20.59C30.28 21.47 30.26 22.35 30.18 23.23C30.1 24.11 29.96 24.87 29.76 25.51C29 25.43 28.08 25.33 27 25.21C25.92 25.11 24.56 25.06 22.92 25.06C21.44 25.06 20.06 25.11 18.78 25.21C17.52 25.33 16.53 25.43 15.81 25.51C15.71 24.97 15.63 24.26 15.57 23.38C15.51 22.48 15.49 21.55 15.51 20.59C15.55 19.63 15.63 18.8 15.75 18.1V13.96H14.64V18.1C14.78 18.8 14.86 19.63 14.88 20.59C14.92 21.55 14.91 22.48 14.85 23.38C14.79 24.26 14.69 24.97 14.55 25.51C14.07 25.45 13.54 25.38 12.96 25.3C12.4 25.24 11.71 25.18 10.89 25.12C10.07 25.08 9.05 25.06 7.83 25.06C6.33 25.06 4.98 25.11 3.78 25.21C2.6 25.31 1.6 25.41 0.78 25.51ZM40.248 26.02C37.848 26.02 35.948 25.71 34.548 25.09C33.168 24.47 32.178 23.66 31.578 22.66C30.978 21.66 30.678 20.58 30.678 19.42C30.678 17.66 31.298 16.23 32.538 15.13C33.778 14.03 35.758 13.47 38.478 13.45L44.838 13.39V11.8H43.188V12.61C41.148 12.69 39.138 12.77 37.158 12.85C35.178 12.93 33.208 12.9 31.248 12.76C30.748 9.64 30.798 6.62 31.398 3.7C31.978 3.7 32.678 3.71 33.498 3.73C34.338 3.75 35.218 3.78 36.138 3.82C37.078 3.84 37.998 3.86 38.898 3.88C39.798 3.9 40.598 3.92 41.298 3.94C41.038 4.54 40.888 5.14 40.848 5.74C40.828 6.34 40.918 6.92 41.118 7.48C41.218 5.82 41.848 4.67 43.008 4.03C44.168 3.39 45.808 3.07 47.928 3.07C50.668 3.07 52.768 3.47 54.228 4.27C55.688 5.05 56.658 6.22 57.138 7.78C57.378 8.52 57.478 9.32 57.438 10.18C57.418 11.02 57.358 11.84 57.258 12.64C57.158 13.44 57.108 14.16 57.108 14.8C57.108 16.02 57.298 16.89 57.678 17.41C58.078 17.91 58.498 18.24 58.938 18.4C59.118 18.98 59.218 19.71 59.238 20.59C59.278 21.47 59.258 22.35 59.178 23.23C59.098 24.11 58.958 24.87 58.758 25.51C57.878 25.71 56.958 25.84 55.998 25.9C55.038 25.98 54.258 26.02 53.658 26.02C52.138 26.02 50.948 25.84 50.088 25.48C49.228 25.12 48.798 24.46 48.798 23.5C48.798 23.16 48.858 22.8 48.978 22.42C49.118 22.04 49.278 21.63 49.458 21.19L48.678 20.8C48.318 21.68 47.818 22.52 47.178 23.32C46.558 24.12 45.688 24.77 44.568 25.27C43.468 25.77 42.028 26.02 40.248 26.02ZM43.188 17.23H44.838V15.34H43.188V17.23ZM69.4446 26.02C67.3446 26.02 65.5346 25.57 64.0146 24.67C62.4946 23.75 61.3246 22.43 60.5046 20.71C59.6846 18.99 59.2746 16.92 59.2746 14.5C59.2746 11 60.0146 8.3 61.4946 6.4C62.9946 4.48 65.1646 3.52 68.0046 3.52C69.3646 3.52 70.6446 3.88 71.8446 4.6C73.0446 5.3 74.1046 6.16 75.0246 7.18L75.6846 6.61C75.2446 6.11 74.7246 5.61 74.1246 5.11C73.5246 4.59 72.6946 4.05 71.6346 3.49C71.6746 2.99 71.7446 2.5 71.8446 2.02C71.9446 1.54 72.0646 1.15 72.2046 0.849998C73.0646 0.929998 74.1946 1.03 75.5946 1.15C76.9946 1.25 78.4246 1.3 79.8846 1.3C81.3046 1.3 82.5946 1.26 83.7546 1.18C84.9346 1.08 85.9446 0.989999 86.7846 0.909999C86.9646 1.47 87.0946 2.01 87.1746 2.53C87.2546 3.03 87.2946 3.54 87.2946 4.06C87.2946 5 87.1946 5.93 86.9946 6.85C86.8146 7.75 86.6246 8.73 86.4246 9.79C86.2446 10.83 86.1546 12.05 86.1546 13.45C86.1546 14.71 86.2446 15.68 86.4246 16.36C86.6046 17.04 86.8346 17.53 87.1146 17.83C87.3946 18.11 87.6846 18.31 87.9846 18.43C88.1646 19.11 88.2746 19.9 88.3146 20.8C88.3546 21.7 88.3346 22.58 88.2546 23.44C88.1746 24.28 88.0246 24.97 87.8046 25.51C87.0046 25.41 86.1446 25.32 85.2246 25.24C84.3046 25.16 83.3146 25.11 82.2546 25.09C81.2346 25.07 80.3746 25.07 79.6746 25.09C78.9746 25.11 78.3746 25.14 77.8746 25.18C77.3746 25.22 76.8846 25.26 76.4046 25.3C76.6446 25 76.8346 24.61 76.9746 24.13C77.1346 23.63 77.2346 23.11 77.2746 22.57C77.3346 22.03 77.3446 21.54 77.3046 21.1C77.0846 21.94 76.6846 22.74 76.1046 23.5C75.5246 24.24 74.6946 24.84 73.6146 25.3C72.5546 25.78 71.1646 26.02 69.4446 26.02ZM72.4146 15.97H74.0346V13.18H72.4146V15.97ZM98.3438 26.02C95.9438 26.02 94.0438 25.71 92.6438 25.09C91.2638 24.47 90.2738 23.66 89.6738 22.66C89.0738 21.66 88.7738 20.58 88.7738 19.42C88.7738 17.66 89.3938 16.23 90.6338 15.13C91.8738 14.03 93.8538 13.47 96.5738 13.45L102.934 13.39V11.8H101.284V12.61C99.2438 12.69 97.2338 12.77 95.2538 12.85C93.2738 12.93 91.3038 12.9 89.3438 12.76C88.8438 9.64 88.8938 6.62 89.4938 3.7C90.0738 3.7 90.7738 3.71 91.5938 3.73C92.4338 3.75 93.3138 3.78 94.2338 3.82C95.1738 3.84 96.0938 3.86 96.9938 3.88C97.8938 3.9 98.6938 3.92 99.3938 3.94C99.1338 4.54 98.9838 5.14 98.9438 5.74C98.9238 6.34 99.0138 6.92 99.2138 7.48C99.3138 5.82 99.9438 4.67 101.104 4.03C102.264 3.39 103.904 3.07 106.024 3.07C108.764 3.07 110.864 3.47 112.324 4.27C113.784 5.05 114.754 6.22 115.234 7.78C115.474 8.52 115.574 9.32 115.534 10.18C115.514 11.02 115.454 11.84 115.354 12.64C115.254 13.44 115.204 14.16 115.204 14.8C115.204 16.02 115.394 16.89 115.774 17.41C116.174 17.91 116.594 18.24 117.034 18.4C117.214 18.98 117.314 19.71 117.334 20.59C117.374 21.47 117.354 22.35 117.274 23.23C117.194 24.11 117.054 24.87 116.854 25.51C115.974 25.71 115.054 25.84 114.094 25.9C113.134 25.98 112.354 26.02 111.754 26.02C110.234 26.02 109.044 25.84 108.184 25.48C107.324 25.12 106.894 24.46 106.894 23.5C106.894 23.16 106.954 22.8 107.074 22.42C107.214 22.04 107.374 21.63 107.554 21.19L106.774 20.8C106.414 21.68 105.914 22.52 105.274 23.32C104.654 24.12 103.784 24.77 102.664 25.27C101.564 25.77 100.124 26.02 98.3438 26.02ZM101.284 17.23H102.934V15.34H101.284V17.23ZM124.558 26.05C120.118 26.05 117.898 24.18 117.898 20.44C117.898 18.64 118.468 17.27 119.608 16.33C120.748 15.37 122.428 14.89 124.648 14.89C129.188 14.89 131.458 16.74 131.458 20.44C131.458 22.26 130.878 23.65 129.718 24.61C128.558 25.57 126.838 26.05 124.558 26.05ZM19.26 53.69C17.5 53.69 15.9 53.66 14.46 53.6C13.04 53.54 11.65 53.47 10.29 53.39C8.93 53.33 7.5 53.3 6 53.3C4.5 53.3 2.81 53.36 0.93 53.48C0.77 53.06 0.64 52.54 0.54 51.92C0.46 51.28 0.41 50.61 0.39 49.91C0.37 49.21 0.39 48.55 0.45 47.93C0.51 47.29 0.61 46.76 0.75 46.34C1.07 46.22 1.38 46.02 1.68 45.74C1.98 45.44 2.23 44.97 2.43 44.33C2.63 43.67 2.73 42.75 2.73 41.57C2.73 40.29 2.61 39.33 2.37 38.69C2.15 38.03 1.88 37.59 1.56 37.37C1.26 37.13 0.99 37.01 0.75 37.01C0.51 36.41 0.35 35.66 0.27 34.76C0.21 33.86 0.22 32.95 0.3 32.03C0.4 31.09 0.59 30.3 0.87 29.66C2.55 29.74 4.12 29.79 5.58 29.81C7.06 29.81 8.49 29.79 9.87 29.75C11.27 29.71 12.68 29.67 14.1 29.63C15.54 29.59 17.07 29.57 18.69 29.57C20.41 29.57 21.98 29.65 23.4 29.81C24.82 29.95 26.05 30.25 27.09 30.71C28.15 31.17 28.96 31.85 29.52 32.75C30.1 33.65 30.39 34.85 30.39 36.35C30.39 37.25 30.19 38.1 29.79 38.9C29.39 39.7 28.85 40.44 28.17 41.12C29.35 41.82 30.15 42.61 30.57 43.49C31.01 44.35 31.23 45.28 31.23 46.28C31.23 47.42 31.05 48.45 30.69 49.37C30.33 50.27 29.7 51.05 28.8 51.71C27.92 52.35 26.7 52.84 25.14 53.18C23.6 53.52 21.64 53.69 19.26 53.69ZM15.09 39.5H17.31V37.88H15.09V39.5ZM15.09 45.14H17.55V43.43H15.09V45.14ZM45.934 54.05C41.134 54.05 37.504 53.03 35.044 50.99C32.604 48.95 31.384 45.93 31.384 41.93C31.384 37.53 32.624 34.3 35.104 32.24C37.584 30.18 41.244 29.15 46.084 29.15C51.244 29.15 55.024 30.17 57.424 32.21C59.824 34.23 61.024 37.21 61.024 41.15C61.024 45.61 59.754 48.88 57.214 50.96C54.674 53.02 50.914 54.05 45.934 54.05ZM45.274 43.52H47.104V39.65H45.274V43.52ZM73.7084 54.02C70.7284 54.02 68.4384 53.63 66.8384 52.85C65.2384 52.05 64.1984 50.87 63.7184 49.31C63.4984 48.61 63.3884 47.84 63.3884 47C63.4084 46.16 63.4684 45.21 63.5684 44.15C63.6684 43.09 63.7284 41.91 63.7484 40.61H61.7984C61.6984 40.05 61.6284 39.42 61.5884 38.72C61.5484 38.02 61.5484 37.32 61.5884 36.62C61.6284 35.9 61.6984 35.26 61.7984 34.7C62.3184 34.28 62.8184 33.87 63.2984 33.47C63.7984 33.05 64.2384 32.56 64.6184 32C64.9984 31.44 65.2584 30.72 65.3984 29.84C66.1184 29.94 66.9884 30.01 68.0084 30.05C69.0484 30.09 70.1484 30.11 71.3084 30.11C72.4884 30.09 73.6384 30.06 74.7584 30.02C75.8784 29.96 76.8684 29.89 77.7284 29.81C77.8484 30.19 77.9484 30.57 78.0284 30.95C78.1084 31.33 78.1684 31.7 78.2084 32.06H84.7484C84.8484 32.42 84.9184 32.96 84.9584 33.68C84.9984 34.4 84.9984 35.16 84.9584 35.96C84.9384 36.74 84.8684 37.41 84.7484 37.97L76.4684 38V44.27H77.3384L77.3684 39.08C77.8084 38.92 78.3484 38.8 78.9884 38.72C79.6484 38.62 80.3384 38.57 81.0584 38.57C81.7784 38.57 82.4684 38.62 83.1284 38.72C83.7884 38.8 84.3484 38.92 84.8084 39.08C84.8684 39.18 84.9484 39.52 85.0484 40.1C85.1484 40.66 85.2284 41.35 85.2884 42.17C85.3684 42.97 85.4084 43.78 85.4084 44.6C85.4084 45.48 85.3084 46.37 85.1084 47.27C84.9284 48.17 84.5984 49.03 84.1184 49.85C83.6384 50.65 82.9584 51.37 82.0784 52.01C81.1984 52.63 80.0684 53.12 78.6884 53.48C77.3284 53.84 75.6684 54.02 73.7084 54.02Z"
            fill="#2D6FDB"
          />
        </svg>
      )}
    </Stack>
  );
};

export default NadabotLogo;
