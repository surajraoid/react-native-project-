import {useState, useEffect, useCallback} from 'react';
import {Dimensions, ScaledSize} from 'react-native';

export type Orientation = 'portrait' | 'landscape';

interface OrientationInfo {
  orientation: Orientation;
  isPortrait: boolean;
  isLandscape: boolean;
  width: number;
  height: number;
  isTablet: boolean;
}

export function useOrientation(): OrientationInfo {
  const getInfo = useCallback((dims: ScaledSize): OrientationInfo => {
    const {width, height} = dims;
    const orientation: Orientation = width > height ? 'landscape' : 'portrait';
    return {
      orientation,
      isPortrait: orientation === 'portrait',
      isLandscape: orientation === 'landscape',
      width,
      height,
      isTablet: Math.min(width, height) >= 600,
    };
  }, []);

  const [info, setInfo] = useState<OrientationInfo>(() =>
    getInfo(Dimensions.get('window')),
  );

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({window}) => {
      setInfo(getInfo(window));
    });
    return () => sub.remove();
  }, [getInfo]);

  return info;
}
