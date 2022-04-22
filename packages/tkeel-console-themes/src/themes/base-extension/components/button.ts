import type {
  SystemStyleFunction,
  SystemStyleObject,
} from '@chakra-ui/theme-tools';
import { mode, transparentize } from '@chakra-ui/theme-tools';

const baseStyle: SystemStyleObject = {
  lineHeight: '1.2',
  borderRadius: '30px',
  fontWeight: 'semibold',
  transitionProperty: 'common',
  transitionDuration: 'normal',
  _focus: {
    boxShadow: 'none',
  },
  _disabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  _hover: {
    _disabled: {
      bg: 'initial',
    },
  },
};

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const variantGhost: SystemStyleFunction = (props) => {
  const { colorScheme: c, theme } = props;
  if (c === 'gray') {
    return {
      color: mode(`inherit`, `whiteAlpha.900`)(props),
      _hover: {
        bg: mode(`gray.100`, `whiteAlpha.200`)(props),
      },
      _active: { bg: mode(`gray.200`, `whiteAlpha.300`)(props) },
    };
  }

  const darkHoverBg = transparentize(`${c}.200`, 0.12)(theme);
  const darkActiveBg = transparentize(`${c}.200`, 0.24)(theme);

  return {
    color: mode(`${c}.600`, `${c}.200`)(props),
    bg: 'transparent',
    _hover: {
      bg: mode(`${c}.50`, darkHoverBg)(props),
    },
    _active: {
      bg: mode(`${c}.100`, darkActiveBg)(props),
    },
  };
};

const variantOutline: SystemStyleFunction = (props) => {
  const { colorScheme: c } = props;
  const borderColor = mode(`gray.200`, `whiteAlpha.300`)(props);
  return {
    border: '1px solid',
    borderColor: c === 'gray' ? borderColor : 'currentColor',
    ...variantGhost(props),
  };
};

type AccessibleColor = {
  bg?: string;
  color?: string;
  hoverBg?: string;
  activeBg?: string;
};

/** Accessible color overrides for less accessible colors. */
const accessibleColorMap: { [key: string]: AccessibleColor } = {
  yellow: {
    bg: 'yellow.400',
    color: 'black',
    hoverBg: 'yellow.500',
    activeBg: 'yellow.600',
  },
  cyan: {
    bg: 'cyan.400',
    color: 'black',
    hoverBg: 'cyan.500',
    activeBg: 'cyan.600',
  },
};

const variantSolid: SystemStyleFunction = (props) => {
  const { colorScheme: c, theme } = props;

  const padding = '0 22px';
  const boxShadow = `0 4px 12px ${transparentize('primary', 0.2)(theme)}`;

  if (c === 'gray') {
    const bg = mode(`gray.900`, `whiteAlpha.200`)(props);

    return {
      padding,
      color: 'white',
      bg,
      boxShadow,
      _hover: {
        bg: mode(`gray.700`, `whiteAlpha.300`)(props),
        _disabled: {
          bg,
        },
      },
      _active: { bg: mode(`gray.700`, `whiteAlpha.400`)(props) },
    };
  }

  if (c === 'brand') {
    const bg = mode(`primary`, `whiteAlpha.200`)(props);

    return {
      padding,
      color: 'white',
      bg,
      boxShadow,
      _hover: {
        bg: mode(`primary`, `whiteAlpha.300`)(props),
        _disabled: {
          bg,
        },
      },
      _active: {
        color: 'white',
        svg: {
          fill: 'white !important',
        },
        bg: mode(`primary`, `whiteAlpha.400`)(props),
      },
    };
  }

  const {
    bg = `${c}.500`,
    color = 'white',
    hoverBg = `${c}.600`,
    activeBg = `${c}.700`,
  } = accessibleColorMap[c] ?? {};

  const background = mode(bg, `${c}.200`)(props);

  return {
    padding,
    bg: background,
    boxShadow,
    color: mode(color, `gray.800`)(props),
    _hover: {
      bg: mode(hoverBg, `${c}.300`)(props),
      _disabled: {
        bg: background,
      },
    },
    _active: { bg: mode(activeBg, `${c}.400`)(props) },
  };
};

const variantSolidNoShadow: SystemStyleFunction = (props) => {
  return {
    ...variantSolid(props),
    boxShadow: 'none',
  };
};

const variantLink: SystemStyleFunction = (props) => {
  const { colorScheme: c } = props;
  return {
    padding: 0,
    height: 'auto',
    lineHeight: 'normal',
    verticalAlign: 'baseline',
    color: mode(`${c}.500`, `${c}.300`)(props),
    _hover: {
      color: 'primary',
      textDecoration: 'none',
      _disabled: {
        textDecoration: 'none',
      },
    },
    _active: {
      color: mode(`${c}.700`, `${c}.500`)(props),
    },
  };
};
/* eslint-enable */

const variantUnstyled: SystemStyleObject = {
  bg: 'none',
  color: 'inherit',
  display: 'inline',
  lineHeight: 'inherit',
  m: 0,
  p: 0,
};

const variants = {
  ghost: variantGhost,
  outline: variantOutline,
  solid: variantSolid,
  'solid-no-shadow': variantSolidNoShadow,
  link: variantLink,
  unstyled: variantUnstyled,
};

const sizes: Record<string, SystemStyleObject> = {
  lg: {
    h: 10,
    minW: 10,
    fontSize: 'lg',
    px: 6,
  },
  md: {
    h: 8,
    minW: 8,
    fontSize: '14px',
    px: 4,
  },
  sm: {
    h: 7,
    minW: 7,
    fontSize: 'sm',
    px: 3,
  },
  xs: {
    h: 5,
    minW: 5,
    fontSize: 'xs',
    px: 2,
  },
};

const defaultProps = {
  variant: 'solid',
  size: 'md',
  colorScheme: 'gray',
};

export default {
  baseStyle,
  variants,
  sizes,
  defaultProps,
};
