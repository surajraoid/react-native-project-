export const getLocales = () => [
  {
    languageCode: navigator.language?.split('-')[0] ?? 'en',
    countryCode: navigator.language?.split('-')[1] ?? 'US',
    languageTag: navigator.language ?? 'en-US',
    isRTL: false,
    scriptCode: undefined,
  },
];

export const getNumberFormatSettings = () => ({
  decimalSeparator: '.',
  groupingSeparator: ',',
});

export const getCalendar = () => 'gregorian';
export const getCountry = () => 'US';
export const getCurrencies = () => ['USD'];
export const getTemperatureUnit = () => 'celsius';
export const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
export const uses24HourClock = () => false;
export const usesMetricSystem = () => true;
export const addEventListener = (_event: string, _handler: Function) => {};
export const removeEventListener = (_event: string, _handler: Function) => {};
export const findBestAvailableLanguage = (_languages: string[]) => null;
