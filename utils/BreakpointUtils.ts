import tailwindConfig from '~/tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';

export const getActiveBreakpoint = () => {
    const { theme: { screens } } = resolveConfig(tailwindConfig);
    const sorted = Object.entries(screens).sort((x, y) => parseInt(y[1]) - parseInt(x[1]));
    const bp = sorted.find((s) => window.innerWidth >= parseInt(s[1]));
    if (!bp) return "mb"
    else return bp[0]
}

export const isSmall = (breakpoint: string) => (breakpoint == "mb" || breakpoint == "sm") as boolean