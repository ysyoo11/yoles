import Bowser from 'bowser';

export const isMobile: () => boolean = () => {
  const browser = Bowser.getParser(window.navigator.userAgent);
  return browser.getPlatform().type === 'mobile';
};
