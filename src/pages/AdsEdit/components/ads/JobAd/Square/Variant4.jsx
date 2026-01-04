import React from "react";
import useAdPalette from "../../../../hooks/useAdPalette";

const imgHeroDefault = "/dhwise-images/placeholder.png";
const imgCoinsStacked = "/images3/img_coins_stacked_03.svg";
const imgVerticalContainer = "/images3/img_vertical_container.svg";
const imgClock = "/images3/img_search.svg";

export default function Variant2({ variant, brandData, landingPageData }) {
  const jobTitle = variant?.title ?? landingPageData?.vacancyTitle ?? "";
  const weAreHiring = landingPageData?.weAreHiring || "WE'RE HIRING";
  const ctaText = variant?.callToAction ?? landingPageData?.applyButtonText ?? "Apply Now";
  const linkDescription = variant?.linkDescription ?? "";

  const salaryMin = landingPageData?.salaryMin ?? 2500;
  const salaryMax = landingPageData?.salaryMax;
  const salaryRange = landingPageData?.salaryRange;
  const salaryAvailable = landingPageData?.salaryAvailable !== false;
  const salaryCurrency = landingPageData?.salaryCurrency || "$";
  const salaryTime = landingPageData?.salaryTime || "month";
  const salaryText = landingPageData?.salaryText || "Competitive Salary";

  const location = (Array.isArray(landingPageData?.location) && landingPageData.location[0])
    || landingPageData?.location || "Offenbach";
  const hoursMin = landingPageData?.hoursMin ?? 7;
  const hoursUnit = landingPageData?.hoursUnit || "daily";

  const heroImage = variant?.image || landingPageData?.heroImage || imgHeroDefault;
  const videoUrl = variant?.videoUrl || "";
  const isCapture =
    typeof window !== "undefined" && Boolean(window.__HL_ADS_CAPTURE__);
  const isVideo = !!videoUrl && /\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(videoUrl);
  const [videoFailed, setVideoFailed] = React.useState(false);
  const heroImageAdjustment =
    variant?.imageAdjustment?.heroImage ||
    landingPageData?.imageAdjustment?.jobDescriptionImage ||
    landingPageData?.imageAdjustment?.heroImage ||
    {};
  const heroObjectFit = heroImageAdjustment?.objectFit || "cover";
  const heroObjectPositionOverride =
    variant?.heroImagePosition || landingPageData?.heroImagePosition;
  const heroObjectPosition = heroObjectPositionOverride
    ? heroObjectPositionOverride
    : heroImageAdjustment?.objectPosition
      ? `${heroImageAdjustment.objectPosition.x}% ${heroImageAdjustment.objectPosition.y}%`
      : "52% 58%";

  const brandName = brandData?.companyName || brandData?.name || "hirelab";
  const brandLogo = brandData?.companyLogo || brandData?.logo || null;
  const timePosted = "14h";

  const { primaryColor, secondaryColor, getPrimary, getContrastColor } = useAdPalette({ landingPageData, brandData });
  const [logoFailed, setLogoFailed] = React.useState(false);

  // CTA Text Contrast - use the primary color as the background
  const ctaTextColor = getContrastColor(primaryColor);

  // Helper to wrap text into lines for SVG text elements
  const wrapText = (text, maxCharsPerLine = 35) => {
    if (!text) return [];
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
        currentLine = (currentLine + ' ' + word).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // Calculate title position to center it between logo and CTA
  // Increased to 18 chars per line to prevent 4+ line titles
  const titleLines = wrapText(jobTitle, 18);
  const titleFontSize = 48;
  const titleLineHeight = titleFontSize * 1.1;
  const logoBottom = 85; // Logo ends around y=85
  const ctaTop = 254; // CTA button starts at y=254
  const availableSpace = ctaTop - logoBottom;
  const totalTitleHeight = titleFontSize + (titleLines.length - 1) * titleLineHeight;
  const titleStartY = logoBottom + (availableSpace - totalTitleHeight) / 2 + titleFontSize * 0.85;

  const formatNumber = (value) => (typeof value === "string" ? value : value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
  const formatSalary = () => {
    if (!salaryAvailable) return salaryText;
    if (salaryRange && salaryMax) {
      return `${salaryCurrency}${formatNumber(salaryMin)} - ${salaryCurrency}${formatNumber(salaryMax)} / ${salaryTime}`;
    }
    return `${salaryCurrency}${formatNumber(salaryMin)} / ${salaryTime}`;
  };

  const CLUSTER_SIZE = 983;
  const subtractPathD =
    "M983 742.962C983 760.688 968.63 775.058 950.904 775.058H251.066C233.34 775.058 218.971 789.427 218.971 807.153V950.904C218.971 968.63 204.601 983 186.875 983H32.0958C14.3698 983 0 968.63 0 950.904V795.925C0 778.199 14.3698 763.829 32.0958 763.829H177.26C194.986 763.829 209.355 749.459 209.355 731.733V32.0958C209.355 14.3698 223.725 0 241.451 0H950.904C968.63 0 983 14.3698 983 32.0958V742.962Z";
  const clipPathValue = `path('${subtractPathD}')`;

  return (
    <div className="relative" style={{ width: "1080px", height: "1080px", backgroundColor: getPrimary(500), overflow: "hidden" }}>
      {/* Background grid pattern */}
      <svg
  xmlns="http://www.w3.org/2000/svg"
  xmlnsXlink="http://www.w3.org/1999/xlink"
  width={1080}
  zoomAndPan="magnify"
  viewBox="0 0 810 809.999993"
  height={1080}
  preserveAspectRatio="xMidYMid meet"
  version={1.0}
>
  <defs>
    <filter x="0%" y="0%" width="100%" height="100%" id="ad44d5d662">
      <feColorMatrix
        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
        colorInterpolationFilters="sRGB"
      />
    </filter>
    <filter x="0%" y="0%" width="100%" height="100%" id="a6acfea541">
      <feColorMatrix
        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.2126 0.7152 0.0722 0 0"
        colorInterpolationFilters="sRGB"
      />
    </filter>
    <g />
    <clipPath id="168aad5af1">
      <rect x={0} width={133} y={0} height={25} />
    </clipPath>
    <clipPath id="8d5bf673ec">
      <path
        d="M 55 79 L 199 79 L 199 117.683594 L 55 117.683594 Z M 55 79 "
        clipRule="nonzero"
      />
    </clipPath>
    <mask id="dcbb8900cd">
      <g filter="url(#ad44d5d662)">
        <g
          filter="url(#a6acfea541)"
          transform="matrix(0.193516, 0, 0, 0.19403, 54.719571, 78.68398)"
        >
          <image
            x={0}
            y={0}
            width={748}
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAuwAAADJCAAAAABdtTiMAAAAAmJLR0QA/4ePzL8AAB4sSURBVHic7Z13eFVVtsDXDYwG0qSGImBEqaL0KlKkjCA6TkFBn4pgQwcckGZBUVSKju2p2ChPZVBnRkBQEA1KVQFBIRSBUEMEDCUIhpb9/shNbjlr7XLuPuUm+/fx8d3sdvY+Z5191m5rARgMBoPBYDAYDAaDwWAwGAwGg3YCkulqtb2qSkpySnL5hIRA4fUHHa1TbNw6OHAeihsWgAAE/5WEhP4HAAAWlZ8F/2OMFQIklGNzpjldZYM7lJdI0+COjm0rhgdU8rOwJ3TTXOAczeUZvEIo7DXuuKNxdFiCM3XRQ3RPbTAEEQj7Fc/3RkJ9LU+yipmhzMHtpOvM2YjJupEnQ1zCEfaU1/fejMcUOlMXPZg30UBAqzHNl1SlonytsxsMBKTcDl9PyrrBEJdQPfv8fpxMvlZjtGP0otICLuwVMtvzMhk1xhCPoMKeurSl2/UwGBwHE/YKq5ryM/lajdG+CODrVQWDAphG8rFA1o0Wa4hLEGF/sq/71dCI6YgNBFZh7/uEMJORJ0M8YhH2Ch+KMxk1xhCPWIT9mSQvqqERMy9qIIgWjUb/kMjkazVG+2fHfMdKC9HC/oIntdCJzHEUJcrpLtDgEVGiUaOPTCZf9+xnTxdAueA7XHwmL+JgnrWvZiX/MwBW9B8AAGOFgXJ/MD17aSHqST47jp98/5Yft/28Pde5+hgMbvEb47D4lgpe189g0EVvjqhPrO517QwGjbxGivqhdl7XzWDQyl5K1rfU8rpqBoNWalGyftaoMIb4J2Ke/Y9UqkGHnK+JweAwEcJ+BZFo8/su1MRgcJgIYW9EJHrUhYoYDK6ym1DZL/C6YgaDbghZX+h1vQwGHYSrMalEms1uVMRgcJpwYa9IpNntQj0MBscJF3bq2MZhNypiMDiNjLAfcaMiBoPThAs7dewh342KGAxOI3Ni87TjtTAYXMAIu6HMEC7s5vyZoVRjDE8Yygzhg1L5nr1meqUAwJmfHdkM2apGckpKyrlDOYcP7XWifE+oXTkt/8jRk/IZalapklB4PD//V+1VqX9pRu0EgHP5x47n7d+pvfhoKmSkw+m8PL3tSGxUKzUlNaUg/3h+3n5pKbFleOKRZ4p/7d29a8e6n3LsFILRtU3rFpeHB+xes3r5Wl2le0Fy+6s716laqfjPXTs2b/w2i58l4+qOVzauFPp79749O1au/D32uqS3adXw0vpRDlV+27l9w/oftT3BCLpe0ahZ0yrBPwoP5e1YtuL7mAtN7tGtWZP0iKBj2RtWL/tZrZjWxN4Yy2bIx6NTfHVrTPUvouf0M/j1Vw6trKF4D7hk5Cq0QZkDySw93s3Hb8Lmab1iqUqlOxbwDtOf+Wx021iKt5Lx0BL0SouGVIuh1NZPraGacH7BLYkqJRHFWIT9MWuawpltYmgDQOtZ5zjPgn11e3JMxXvBnWs5DZpxGZKj4qNc6w6/T+tkrya1hq/glVvMO1x3K0p0/oZznS9vtFdo8tDNghZ8JG+AWlrYH0WTrfuLvTYAwK0/iB/FTMljsK2I/OnCnKPxjAVkhibRSb8L2RoZJ2rPJ5ajMsNOCm/Clp5yNyGMivdI3NwgO8dVEhcYZHZ05iElUR0yBdc5+MRFyu2o965MC7bfIVlcjMLO2P47lZsAAJWfOi7TDMZeltJmuhK5xcdox+AZj5IZmlrSTg/G9CSProcxK0Kybs6RugmZV8rchBJaTy+UKraY0w/LlvwvS976RREXzZG4zklZoQyS/rpsC3LvlSqQ6hMtwv4IeaXV1GEnmqGEpo4xXsLEcBcibxVhTqJnp7cGWXp2xioDACRKdUKMnQo5Va7znVwWxti78naWbxd99xFyb5Er+wNLzo8AAOC6Y3LXWdVEuhkA41Re2YP3S5SoQdgZe0yhCQDQUe1x/M7zWFlEFyKr+AOtoWdnkwCgyU7p9vxvsKRep6WzMJYjrVtPVyg1xKcpMmVbhZ3VB0iaKX+dAbLNaLpDsQUHBgvL1CLsbLZsEwAg8R3FVjD2iqhMSo0R60A6hJ2lQHeV5qxMBgCYoJKFMfas5P3toFhukN0y32dE2N+CpNUq13lcrhWDbDThc9HjltbZ+YOvr6UnThqpvrGMMbYZm8cIgxJ2scNuQthpNQYT9mf+ptacrwGSv1DLwhj7VPIOZyuXzBhjrEBiVgMRdlZvndp1Zsq0QVpbj+CQYOaqDZHv8uiEgpmGdZJK5WBbrWBnu3JL1d6z55EZMGE/r9qcV2vZkcg1ctMmwjkhit7Cot9HcikMv4p4S9yE+XabYB1qh++Noazuq5pjb7lYanZ/wjuK5QYpv3SIOJFG1JqvvNnowZ0ZqlkAoPU6qampmTaKBgCAebaWTf6gmuFuoZWWf4tHaQRT34wOcWQjWCeZr+yj422X//ZY21l5EHuDnHa9oLLuFyLjE5lUuV/ZKhzgwkyBtqhpj+zE2/jx/7S/eAP3LIw6VS0j7JY0wnb2EM/JjJwocWWK5/5Kx1HfJwdea0/3RF/zT5lU08VJcJLn2c2pxqyLebGDZFx8kfRZGTmvJCMCNrq2p0UL2wOeVy80jI9bk1FUbX3tG8cO/5Dp9P5ru/gmAicsmkh4jROZYftdLaJ55MYEpw5vfMSPrqMyQYmRKV4j0oVvz7TMkpgPL7A5MAKAZ+2MJdS5gaOUx2pjdGRkAbY+7hKPv9ZQbrSEZ2E+Ka/HWkL8k/ScRCLLKE2eWfazqkB37X/pGFvJD0dpejI9uyVcpq+byBt3je0gUQKf/pRfP+lWxD8PNBWnWWv/eEbnrrazqlCnPxXzamwFj4z2cxou7IVEJiqcS6W76bgaMl2SiNmEN7PzRHpbrfA5Ml5r37Vf/CP2s+q4zJ9q8nIVbF+zZs2abXSC6H7dphojNdYbQUfZn3QMI+0+HaX4l183ch5kkN61xeVYhf3swW3fZR04K87as5k4jQau6oqH0zMxJ6b2rVShQdu2bds2qtB17CIsCbP06zbPoO7Kril2EnlJl2+ImLq8XWn5q7bu3JF39GgeJDdp174XZ5F//IvCOjiM8KU/vmLj1uxfjxyEajUv69SL8vVgYdPc7zftAgCoXav7QO6W3vvE20sOLQntgc/esGF91q7iv1pe0awTX5987GZuNJ+Vi3MP/nJoT1JaWmrd7r15o917vsZCL7mGSH5gRNiQr+CbbyYn3vgPi3+7UYKZ2auJdVdieSGtyV3kGSnGGPsPdZ1ZdJ7p3aPSdvqYTowrSj2I1OL19bF4RtrUJbZdIIwl10Um7y61S+rcc5Ezz5c98zudWMYyYf+ipOsn3YCcmMh4+SyvMpxiLYc3Ijg2Iup+X8rZDomfQ3+SSL0Qe5LtV0Ym4ugVRSgKOwBAM2yHRDFEnovIDNnYZ7NFFpV8E1q8X4Q9J/q9BYAHxTtnplvnEzO20smvFbYK4BxjOx6vS8UmTeLU5joql0DYsQ9OL7rx6PeFONW4nKjPoPAjjSN59wMAbAk7wF/ozT/EZ+g+Kv2H+AROxblUhnpYcp8I+1fo9TqIDiEMx3Kl4ue2GWNsirBVAC+9wj/d1O0gWTxnlp4j7MdaoDlakR+RqUjqikRacsW1SqhGwn6dFnbLrscI2pEnJyfjGagnN4e8xCIiBzqM94ewU/3PTXxpfwjPlbSMyvCjsFUSVNlIFU/v+OQIeyG1vN2eyoF9o4k9uG9z2vGnYMcr7tdt9uwA3agmrEeT1yZSc7YsJeXiWX7CEvtC2A+Qi5tTyDyMMXJ9pWoelUWL1YUqW6jiG5J5aGGnR7UvUVkQPxgD8JQ38NpxeRZj7LzUfhqbwo4cvQ2Cpn6ASMybq7iRyIM9aV8IO+lRFoBzDpHjz6cfled6YbNkqEGdeacPpJLCztkJUpnKc7U1LXGqn79HNGUhY7Ss21pBjWIMFdEACyS2iH2GDzeLmEd8rS0TTj5hMTr1WwSmnwbh7NP/lJp01zMV/stTREQr9bI4SsQRavMCcqoWn3QuoA2bAACc6DvzIXpGOlzY7e4X3EvtdGmOBRKnAvjHKomTpzaNBjnOBE7cjBNUTNYqTraXiHCVM/ocXiDMdqoL++e5nMg3iHDEHBluWeaU6PKDXqbjdPTs8G8ivDESloQrRXkruVcgXifk60fW1vYWX/VNNbmrebHkQJy7QZFSDtRtl+AQnQ0t7NRteY93lR+P4eHkxGg0MRlC1HKkgRpbYja80N4e4GP+FU4uQ4PRuUfvmc+NJXc/c08V5ROaka4VfeIVTJU3UhNkCTc2Ew9GJIWw5Mo96yFAyxnUo7vxcGwjTw08qWjPL34LsZb74JAG33EsNSvJNnKz/YAHXyhRHxkOEjqU2GpgJDl829Rb8OA61qDjeMqbFOsTjp7DarvxYMziHGHkj3iUJeDDV8pzq8fs4caeJqy0b+cXmk2E6zrFQvgxV7W5K7DDTm04tr6zu5BUADAuhmeuR9iJp5uGhOHzwoUij3yE9e1YPmrOQZtVAgCAHXgwoc4Wc4AI12XemLAaLza3EwnRIRdzkAi3zigSLgZqxnCkREbYxSM04nW+AAnDe3ahJXliKQ9Zu/HBIQ2B4wCiZydnabi5QN7uLh/iy6Eq7IKdw9TMoVVUviNS/nWRqmZVgp4D18SDwBYA8KXF/aIrEN0e4jiEqi11qMMBBN5kiOkzwW2mJt109ey78WCsw+IhaAXVD1gtzhzdSiTtvdOmfXepqUexsBMPAhs84SqX0PskkQARdh/07Gf40RLHJhDOEeG6RqjEh0XZ7hEf6tYgrVhMlZE0N2eCxKkVKwnE73Bsiw82vYP3FEJhJ+45UhrlJUr8DVNuJ5XB3glAm9NIuqSReGnInl1vp4KUxrECVWv8/sybVb85elZQlZ4Tfo+Ewk70hogEUz2g+OEoSxuVgaoCP5vNQ7LUhLEqxP0hi3d8ivcb7tCn25zT01SND9jylmdBoeH4Be12T3qqbxdXp/SpiykJe1q7ehfXq1c1NTVNtmNW7cA1Do1mCpwK3Htv3qz38a21OOHSYl+NUbgjuFgL1+mIR6pVo1T+MGvX+3jEbCKkXMfeffBTFTxI7Y+4rkYrg5OFHjSqjBix9/33qJGsBdc9XONSa1fYFWZjfDBwdQS5rrR839kFyx5Vl3VlNH7t9vC3XRRR95Et28ZIrnzJ6AFadXb87Wq/LgCsSB4jy2LB/4hHipRGPXytrShCrykaQWk2BwgAANB6uMBYLg1ZK70jD5Qx3JMaJTSYNGnlvPliwyPuK734BS9oqa00H+yNcRWxdN0yyubd9Zqtz8qaaerUacrBWW8TS9MluK7G6L2gtwNUXyBSY9pv+5ePZF3mOxTi6d3yadNHb/9pFN+9qk90drsgwk71dKVVZ+eT+uZq9LyYY2j9sBb04h9MiqLZlKNf8Ox4uy7semUOeXV8oMb4oApBuu+5J8YSVAVE766M7ao7env++8gIcl+kU/bZSfT27IhY+cCAqYvbcLgkvvKVutv0KFSFQrMQLfqzao5KL+RTVkBlVlC1ovdm+ECytaH9Fan+3d91F+k+n1ynvJWo3BvL8K0zca6zI8JemuQ/Jhr/xDcE5gzae8xFzdUtzHfORm3XOCrsWC/uuK7kH4XZWxpusr3v219svpKySUBzwRzMclicTz0i3bgRdgAASF3s+qN1ilNDW6xRzjRknXWc6nrP7tkjcHHqUXApQtHSW8FPPLK8IOhrqMfPF4sNbftRxv5JWi6x3FBHZQ9ruONL7GrLFo4geOBEtNZP0ijEYLYrCJ4vFS1q/IKujV8RnFuMpuOC6JA4/9YpvDou9uz2hF0ndQkLynHM1uGp/Uj/Fih9oq3E6zlwTYDNvPh4skTbSSXBTdXbwaClzdD2apMFERGCC8fU9gV/TRsqsrkSzlNRtkAd8nBdBDZzrFfYtS4qaTupJJgx1zuhjrW3C1eJ2TH9rhbVAtEQ85TkTbG36zFGX4b5b7Sq/wxhZANhXuSRf9fVGMd1du2fDrpAm1vnHT+9yfPpuGl0jcsHz9hgNX6iOtax17PH7qU2+7F6zR6X9MGQHumCw/XZGMfVGO0acfzNZTbpRcUc6t1sKmGnyC97HCTYNLF5rRE8E+cljI/YLhHnA1SBFa3ShMI7R+4S+L9LvyAz2TPw4RW5LzZrPFn89C+M+Mbp2RCuMHOMdyAn+zL0tQswqqSiI0zIcMVs8QXK0/2LPMda7gi7xs/k1rFjO981UGBQ4+9jwq7oqHUBbDYGt5KzU3nNQLUuPpp6dJo6hLXzN7lO5ITWTHzI8uWD+tz5N16KxBvnhv4I709d0drw3fg5+i7g47lNl+iLB+/gO9Yijkn4/YP4Wf/qL/IssIV7hnZdZ8fvqeLimIEH4qAIAOBuvr1VTY/A/Zfj8IhKI2ntPVyl02P+TuGVwYVdYB1RBftqjLIlFJs3zJ48ULmsuuJVaLoDX/PLJxRazYtKNtfh+Jz6Z/pUUnUM854dfhG7+xaUVAfcBqpGLVe7ET+6cTZvmL3Gyq9g4Z583hKUT8yza15UooqLUfk8M7oXZeW4R+inHjVG4fHhPXvMp8dClHmdnbCovtTdWrjNl72JiG6hn3qO5SnkxBXHmJygRULVxbalPJ+vUllKI+7lBkE5xByeamVtNi52VX/FC3h4mDtB1weo+NcGcyJpE2pOSZfRfr9h0bUxT1YA+SJHPhXwYJcERMNlCL/FNUO9nB7rAgpDO9y5bGVdbrDoVij7OBQVaBuH98akosmEW18I7UdVCm1KrYZ7kv8ZHt6w5JfrPTvhB6sHHmwD6juq6vYtbsGnVYTSpOo8yX/gvnLDHAq7LuyE9yS7bnKsUCuBmvye+x/8kQofNCHsfl9UCoNwP5uA/Ipl+yVhHwO7wb/gSQfocg1EuqgSGzxUnjmmBEhgLkTvPLsFfM0iTWTDRNUvvI/m2YMQo5LQJfXMsxMKIRZMLdT1F15EEsoJaRdhTuWZY5tWpB12uUTcAJFhjc4KdQEg6yPYc6J83qVPa8n6kCuToUu6PkCFn/C0E2xfPBrivtWtb7M89dvi6gqqBWLpHF9XDSHuDKSwOcNLta7Owu87EFEWiCmIUPeqR2dXeXwr8eCMB7TUBGi/57fbLE9dNgU31WE1mDi1xjNvCwDXalrX0zwb8xEElsh+c5rhwSFV3vVFJWrMDC/pmmunhP1Bm+Wp3xabS+aaOImPWlCDcCGGa7q63gXsJ9sDJC2TdBtyNRp6+nDJT0e3C6ANX0GUUf5zyWXUawXxlB/wyqPkyo9GXTY9NqWBO9RKHszL06KfI1WRBn9HujwBAADvPSNVBu4pMsyYmKNqDFr4fmqIWm8R7uo9kgdPfFmJn+JbKmJKOyqGC6116D1wrW0W+Gc8eAKxRgoAUJHjYdcV0MZXLT548chCfFk4gv+pgQaH+Y704Azq+1REm7VCk20Dc15NBoF9/eVkTCb+ofMJ2h4FMSqq/SKd5V8eGcvjM6dkHNFn/xBR4mTC/Ona0E/31Rh4hSymwa6HeVdJH5X9QS0AGM2vzG+ktFdcPoX0ykDj841gVqj23zuUyvGWnFs6B8FEZUSYwvqHt1fxx6mJ84jJmLBNBB707FuJngcAAlOzyds+YOkvUzIAAKAy99Qh1+n9qH23e78hzGlhJ/c3vjYSDa44/W403GNaR25j7LDsR95azFzCLtTKMAs5XpjSeJ0TlzEvZ4J1YrXtiPlsdteSPwUjzfc4cZVnndjwn0kP3dy5scYt9H6DdJb7/OKa1sDuPw9ysjJ2SbH0WVd+ePRlwm3xPfup7ezzwn47al2AYPYL+FCiiFrjx8O3mXv2FQBAUnJSUlJ65+iV/jbNuZuzf53P/SpfFVxeabBdoq4uom/6fRbZ/l4HXnl+X3hAtb89dLm268aAtfEzL7amumjYsF2L1q7ZGBFYodt1t9JzFh+H/fbEkejD5Bg1SHvizHAxYwZwo1+WUkH1OrzxEwvP020bNmzDp/tyfgeActXT6/bWeJBAL4MJz2EZ9wPAnp3b9x07erQA0us3aMCVlf/uDvtDj7ArTqZ9MEq0di3glocIG25FZK4nvnYROLeQ6aQlWxlOv3U/J7Y5fkbVW6JvWZN3eKnr1ZM1Pz8l/A89JqtV5YZvwUQCwXrfk7GWHxvebhcAgImOX4HEZuOisiVqmvdfHbHC6I2tx6X/jbEAwdsynzZpGMJvO7VtTtJgk3YHpsVUE+95U5Nb7sipbNetCxRxe1ZsF0wUrDEMkaiRczOAru6NQUt7wjNnOzYbF5lt4O16btKMVRF/6lFjiFLowk/+kTLzIQnHAjkAwD7+CBYAkNrF5+EN9GKH7rJ1DRWcPLyRq+e7+3uUcUsZW4+2jSRxerj9qmcFosgQbAf7cIawCEvtlB17Ue1zpGdXO/bw3qe2LqKAPTdockaSlvbQ0rEPjNra76j5O95n44dusX1pxwji76O3yARxrme3N0AVPF+lnh3gVnW/0Go4eizvK9KdggKj50YFeOeM4OsWv8WSvecl/Pgzf4xxWBDnnOhCnU+MC77sEHP135kaHeKorUf+53zTVYSlATkEWjucumYLP0HsaoxNB2J61RjqJud0UHdLsk0hrV41xhL+bWPqXIIkk60bflz3qRRGdqvPYyhcaC3gSGf8FIPz+GNSc1sTSTdbJfTzbFiLcLC9qDvjMmCsNUzPsTwCUYGH+txm11b1ybvFp87zrv6eF+3c1KO93s2mtktfLLcjuSMM40zPBasUXg+9bzTWiucakOdwRGxpPgcJlRmgiiEaLt598kEte0tlk9O5y8lB8trxznN51v/q/ZpymnHqxtvkZ3gLun8J8HzM1dF54Hp7h7vseYN5DP+ouW9dIJK8P7dVnyR7PX3sSbmUj3VSUUO9xYmX74M6WA+HsaLpSgB4/3h0uKozAr3MqE7Y5uUx9zKij4saoHrg+mrNDZe+rZTh1eoP4NZRMVY1Gka9F3GmxthbBTkyIONNfrkAAHBuSOciowyWGQxVmbb5DlCtOPJw5Sd3KZW0oNlN1KxruLAXEFW1vRFM0mDOrnuqjZWdJ/zi5sCww+JkYbyafL/8u6GG4tR3bFDiIPo2776v+iTBksaZp6u/G/z5mnR97M2zU9C37OiES1tOkZ23yxpfrx/tDTh8i+8v34bXNRCAAAskBIDxHU8BAOz5nrFAMG8AAgEACCQEmPRU6a+TJzcYPEhkZ3fH0qWL7My+TpvW886B1uDYe/aTaxgLsFA5AQAIBArPC25YVo3waweK/jEmcNl84nvGAAKBQHHNAwAQgMIjwmoeHjfhxkHUSR6A40+/EdLsjz3RJxAIVY8Vkt1qVgZjhQwCgQj5ZoTBt2Ly1xYyYBFyBgCFjKuWrl8/psUtvYQ7kzMXfbKDm8Afs2RFZLRq16ETHnXgh+9+WCEyp8/lmmt7tEyMCGkcPTM59jk05y/IUbb4I63/bddYQw+tWL4McZzsSyp263YtJfBbt61fSlnfCuEnYQcAgJoNGzdoWTUlOaU85B89cuzIkbx9O3ftJZx0KpLWtHb16uk1q1WrmpoA0DDavsq4Z9FcpUPYAQAyWrZrVy01Oak8/Jaff/jHrE0bLeNRn3Nhk2ZNWzYNeyCnN2VtytqiptWXORLrtLLYDBrHUHK9qJ/BATw5g+oDCvbts4T57itn0It3G8EMBpcxwm4oMxhhN5QZjLALKfMus0sNRthDEAbxYjwta/ANRthDXIIHG2EvLRhhD1EXD47p9KDBRxhhD0E45iB8chviDiPsJVD2J/mbiwzxgxH2EvoQ4WbjhaG0ETiAb41hvnbEZDDYoB8h6yxRnNdgiCdS8ghZJxwtGuIPo7MH+ZByOUy7OzMY4pL3KCWGee410WDQSdoHpKwbld1QqrjzGC3rXvs5Nxi0UbXPRI6oM3a91xU0aKMMH0XrOTC9+sXpgkTHaA+bBkPc8DyvQy8mJkuyBn9RhqceZZqeZ8PUoMGvlGFhlzEQO/K049UwuEYZFnYJ83ffznK+GgbXMMLO4Wx/F6phcI0yLOxihlsNKRniGCPsNEve8LoGBq0YYSfJNUpMKaMMC7tgPS2nrbprRYOvKcPCzh+gZreJyUurwYeUYWHn9uxrWxpL1aWOMizsvJ794zbxZqbfIKYMCzvds58fbMampZGy6oyAx/I7jPWMUonp2aPZ0e8aI+ulkzIs7CgHBjdc4HUdDA5h1Jhw1kyf5nUVDM5RhoU9So05lfnlbDXf2YY4owwLeyEAC0r8luXfrNrtbW0MzlOGz6ACAFSonl4Rcrd5XQ2DwWAwGAwGg8FgMBgMBoPBYDAYDAaDwWAwGFzl/wH1QATxO8IVagAAAABJRU5ErkJggg=="
            height={201}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </g>
    </mask>
    <clipPath id="9e5ced51a1">
      <path
        d="M 54.71875 254.089844 L 235.695312 254.089844 L 235.695312 299.289062 L 54.71875 299.289062 Z M 54.71875 254.089844 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="adac7724ae">
      <path
        d="M 60.71875 254.089844 L 229.558594 254.089844 C 231.148438 254.089844 232.675781 254.722656 233.800781 255.847656 C 234.925781 256.972656 235.558594 258.5 235.558594 260.089844 L 235.558594 293.289062 C 235.558594 294.882812 234.925781 296.40625 233.800781 297.53125 C 232.675781 298.660156 231.148438 299.289062 229.558594 299.289062 L 60.71875 299.289062 C 59.128906 299.289062 57.601562 298.660156 56.476562 297.53125 C 55.351562 296.40625 54.71875 294.882812 54.71875 293.289062 L 54.71875 260.089844 C 54.71875 258.5 55.351562 256.972656 56.476562 255.847656 C 57.601562 254.722656 59.128906 254.089844 60.71875 254.089844 Z M 60.71875 254.089844 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="f3258a81a1">
      <path
        d="M 0.71875 0.0898438 L 181.679688 0.0898438 L 181.679688 45.289062 L 0.71875 45.289062 Z M 0.71875 0.0898438 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="c5ec1d9bb0">
      <path
        d="M 6.71875 0.0898438 L 175.558594 0.0898438 C 177.148438 0.0898438 178.675781 0.722656 179.800781 1.847656 C 180.925781 2.972656 181.558594 4.5 181.558594 6.089844 L 181.558594 39.289062 C 181.558594 40.882812 180.925781 42.40625 179.800781 43.53125 C 178.675781 44.660156 177.148438 45.289062 175.558594 45.289062 L 6.71875 45.289062 C 5.128906 45.289062 3.601562 44.660156 2.476562 43.53125 C 1.351562 42.40625 0.71875 40.882812 0.71875 39.289062 L 0.71875 6.089844 C 0.71875 4.5 1.351562 2.972656 2.476562 1.847656 C 3.601562 0.722656 5.128906 0.0898438 6.71875 0.0898438 Z M 6.71875 0.0898438 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="fac11d138e">
      <rect x={0} width={182} y={0} height={46} />
    </clipPath>
    <clipPath id="bcb7a3a7f5">
      <path
        d="M 54.601562 697.773438 L 287.101562 697.773438 L 287.101562 781.023438 L 54.601562 781.023438 Z M 54.601562 697.773438 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="a7b39a34fa">
      <path
        d="M 329.410156 253.140625 L 764.628906 253.140625 L 764.628906 810 L 329.410156 810 Z M 329.410156 253.140625 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id={2287997338}>
      <path
        d="M 336.160156 253.140625 L 757.878906 253.140625 C 759.667969 253.140625 761.386719 253.851562 762.652344 255.117188 C 763.917969 256.382812 764.628906 258.097656 764.628906 259.890625 L 764.628906 1027.550781 C 764.628906 1029.339844 763.917969 1031.058594 762.652344 1032.324219 C 761.386719 1033.589844 759.667969 1034.300781 757.878906 1034.300781 L 336.160156 1034.300781 C 334.371094 1034.300781 332.65625 1033.589844 331.386719 1032.324219 C 330.121094 1031.058594 329.410156 1029.339844 329.410156 1027.550781 L 329.410156 259.890625 C 329.410156 258.097656 330.121094 256.382812 331.386719 255.117188 C 332.65625 253.851562 334.371094 253.140625 336.160156 253.140625 Z M 336.160156 253.140625 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="d7d659ba0c">
      <path
        d="M 0.410156 0.140625 L 435.628906 0.140625 L 435.628906 557 L 0.410156 557 Z M 0.410156 0.140625 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="ea6874de6e">
      <path
        d="M 7.160156 0.140625 L 428.878906 0.140625 C 430.667969 0.140625 432.386719 0.851562 433.652344 2.117188 C 434.917969 3.382812 435.628906 5.097656 435.628906 6.890625 L 435.628906 774.550781 C 435.628906 776.339844 434.917969 778.058594 433.652344 779.324219 C 432.386719 780.589844 430.667969 781.300781 428.878906 781.300781 L 7.160156 781.300781 C 5.371094 781.300781 3.65625 780.589844 2.386719 779.324219 C 1.121094 778.058594 0.410156 776.339844 0.410156 774.550781 L 0.410156 6.890625 C 0.410156 5.097656 1.121094 3.382812 2.386719 2.117188 C 3.65625 0.851562 5.371094 0.140625 7.160156 0.140625 Z M 7.160156 0.140625 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="c0f1f33f99">
      <rect x={0} width={436} y={0} height={557} />
    </clipPath>
    <clipPath id="8484e09237">
      <rect x={0} width={540} y={0} height={77} />
    </clipPath>
    <clipPath id="6b23e0a08e">
      <path
        d="M 54.71875 611.425781 L 511.371094 611.425781 L 511.371094 676.011719 L 54.71875 676.011719 Z M 54.71875 611.425781 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="0d1722ac79">
      <path
        d="M 62.21875 611.425781 L 503.796875 611.425781 C 507.9375 611.425781 511.296875 614.785156 511.296875 618.925781 L 511.296875 668.511719 C 511.296875 672.65625 507.9375 676.011719 503.796875 676.011719 L 62.21875 676.011719 C 58.078125 676.011719 54.71875 672.65625 54.71875 668.511719 L 54.71875 618.925781 C 54.71875 614.785156 58.078125 611.425781 62.21875 611.425781 Z M 62.21875 611.425781 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="4277cfcbf5">
      <path
        d="M 0.71875 0.425781 L 457.371094 0.425781 L 457.371094 65.011719 L 0.71875 65.011719 Z M 0.71875 0.425781 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="a22f19dbbf">
      <path
        d="M 8.21875 0.425781 L 449.796875 0.425781 C 453.9375 0.425781 457.296875 3.785156 457.296875 7.925781 L 457.296875 57.511719 C 457.296875 61.65625 453.9375 65.011719 449.796875 65.011719 L 8.21875 65.011719 C 4.078125 65.011719 0.71875 61.65625 0.71875 57.511719 L 0.71875 7.925781 C 0.71875 3.785156 4.078125 0.425781 8.21875 0.425781 Z M 8.21875 0.425781 "
        clipRule="nonzero"
      />
    </clipPath>
    <clipPath id="805dbc8603">
      <rect x={0} width={458} y={0} height={66} />
    </clipPath>
  </defs>
  <rect
    x={-81}
    width={972}
    fill="#ffffff"
    y="-80.999999"
    height="971.999992"
    fillOpacity={1}
  />
  <rect
    x={-81}
    width={972}
    fill="#ffffff"
    y="-80.999999"
    height="971.999992"
    fillOpacity={1}
  />
  {/* Arrow icon */}
  <path
    fill={primaryColor}
    d="M 764.625 81 L 764.625 116.589844 L 757.5 116.589844 L 757.5 93.160156 L 734.035156 116.625 L 729 111.585938 L 752.464844 88.125 L 729.035156 88.125 L 729.035156 81 Z M 764.625 81 "
    fillOpacity={1}
    fillRule="nonzero"
  />

  {/* Brand Logo */}
  {brandLogo && !logoFailed ? (
    <foreignObject x="55" y="35" width="200" height="50">
      <img
        src={brandLogo}
        alt={brandName}
        onError={() => setLogoFailed(true)}
        style={{
          height: "45px",
          width: "auto",
          objectFit: "contain",
        }}
      />
    </foreignObject>
  ) : (
    <text
      x="55"
      y="65"
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
      }}
      fill={secondaryColor}
    >
      {brandName}
    </text>
  )}

  {/* Job Title - dynamically centered between logo and CTA */}
  <text
    x="55"
    y={titleStartY}
    style={{
      fontSize: `${titleFontSize}px`,
      fontWeight: "900",
      fontFamily: "Arial Black, Arial, sans-serif",
      textTransform: "uppercase",
      letterSpacing: "-1px",
    }}
    fill={secondaryColor}
  >
    {titleLines.map((line, i) => (
      <tspan key={i} x="55" dy={i === 0 ? 0 : "1.1em"}>
        {line}
      </tspan>
    ))}
  </text>
  {/* CTA Button */}
  <g clipPath="url(#9e5ced51a1)">
    <g clipPath="url(#adac7724ae)">
      <g transform="matrix(1, 0, 0, 1, 54, 254)">
        <g clipPath="url(#fac11d138e)">
          <g clipPath="url(#f3258a81a1)">
            <g clipPath="url(#c5ec1d9bb0)">
              <path
                fill={primaryColor}
                d="M 0.71875 0.0898438 L 181.519531 0.0898438 L 181.519531 45.289062 L 0.71875 45.289062 Z M 0.71875 0.0898438 "
                fillOpacity={1}
                fillRule="nonzero"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
  {/* CTA Text */}
  <text
    x="145"
    y="282"
    textAnchor="middle"
    dominantBaseline="middle"
    style={{
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "Arial, sans-serif",
      textTransform: "uppercase",
      letterSpacing: "1px",
    }}
    fill={ctaTextColor}
  >
    {ctaText}
  </text>
  
  <g clipPath="url(#bcb7a3a7f5)">
    <path
      fill={secondaryColor}
      d="M 271.730469 781.007812 L 287.101562 766.332031 L 261.484375 739.492188 L 287.101562 712.652344 L 271.730469 697.964844 L 232.101562 739.492188 Z M 271.824219 702.988281 L 282.09375 712.773438 L 256.589844 739.492188 L 282.09375 766.210938 L 271.824219 775.996094 L 236.980469 739.460938 Z M 227.390625 781.007812 L 242.765625 766.332031 L 217.148438 739.492188 L 242.765625 712.652344 L 227.390625 697.964844 L 187.765625 739.480469 Z M 227.503906 702.988281 L 237.757812 712.773438 L 212.253906 739.492188 L 237.757812 766.210938 L 227.503906 775.996094 L 192.660156 739.460938 Z M 183.046875 781.007812 L 198.425781 766.332031 L 172.804688 739.492188 L 198.425781 712.652344 L 183.046875 697.964844 L 143.421875 739.480469 Z M 183.167969 702.988281 L 193.433594 712.773438 L 167.921875 739.492188 L 193.433594 766.210938 L 183.167969 775.996094 L 148.316406 739.460938 Z M 138.710938 781.007812 L 154.082031 766.332031 L 128.46875 739.492188 L 154.082031 712.652344 L 138.710938 697.964844 L 99.097656 739.492188 Z M 138.832031 702.988281 L 149.074219 712.773438 L 123.570312 739.492188 L 149.074219 766.210938 L 138.832031 775.996094 L 103.980469 739.460938 Z M 94.375 781.007812 L 109.726562 766.332031 L 84.109375 739.492188 L 109.726562 712.652344 L 94.375 697.964844 L 54.746094 739.480469 Z M 94.488281 702.988281 L 104.738281 712.773438 L 79.234375 739.492188 L 104.738281 766.210938 L 94.488281 775.996094 L 59.640625 739.460938 Z M 94.488281 702.988281 "
      fillOpacity={1}
      fillRule="nonzero"
    />
  </g>
  {/* Hero Image Area */}
  <g clipPath="url(#a7b39a34fa)">
    <g clipPath="url(#2287997338)">
      <g transform="matrix(1, 0, 0, 1, 329, 253)">
        <g clipPath="url(#c0f1f33f99)">
          <g clipPath="url(#d7d659ba0c)">
            <g clipPath="url(#ea6874de6e)">
              {/* Image/Video clipped to the rounded rectangle shape */}
              <foreignObject x="0" y="0" width="436" height="557">
                {isVideo && !videoFailed && !isCapture ? (
                  <video
                    src={videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={heroImage}
                    onError={() => setVideoFailed(true)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: heroObjectFit,
                      objectPosition: heroObjectPosition,
                      transform: "none",
                    }}
                  />
                ) : (
                  <img
                    src={heroImage}
                    alt="Background"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: heroObjectFit,
                      objectPosition: heroObjectPosition,
                      transform: "none",
                    }}
                  />
                )}
              </foreignObject>
              {/* Primary color border around the image */}
              <rect
                x="5"
                y="5"
                width="426"
                height="547"
                rx="6.75"
                ry="6.75"
                fill="none"
                stroke={secondaryColor}
                strokeWidth="10"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
  <g transform="matrix(1, 0, 0, 1, 54, 132)">
    <g clipPath="url(#8484e09237)" />
  </g>
  {/* White box for subheadline - only show when text exists */}
  {linkDescription && (
    <g clipPath="url(#6b23e0a08e)">
      <g clipPath="url(#0d1722ac79)">
        <g transform="matrix(1, 0, 0, 1, 54, 611)">
          <g clipPath="url(#805dbc8603)">
            <g clipPath="url(#4277cfcbf5)">
              <g clipPath="url(#a22f19dbbf)">
                <path
                  fill="#fdfdfd"
                  d="M 0.71875 0.425781 L 457.371094 0.425781 L 457.371094 65.011719 L 0.71875 65.011719 Z M 0.71875 0.425781 "
                  fillOpacity={1}
                  fillRule="nonzero"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  )}
  
  {/* Subheadline / Link Description - positioned in the white box */}
  {linkDescription && (
    <text
      x="283"
      y="648"
      textAnchor="middle"
      style={{
        fontSize: "26px",
        fontWeight: "600",
        fontFamily: "Arial, sans-serif",
      }}
      fill={secondaryColor}
    >
      {wrapText(linkDescription, 35).map((line, i) => (
        <tspan key={i} x="283" dy={i === 0 ? 0 : "1.2em"}>
          {line}
        </tspan>
      ))}
    </text>
  )}
</svg>

    </div>
  );
}