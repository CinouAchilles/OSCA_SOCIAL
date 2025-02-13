import logo from '../svgs/logo-white.png';

const Xsvg = (props) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
    {...props}
  >
    <image href={logo} x="0" y="0" height="24" width="24" alt="X" />
  </svg>
);

export default Xsvg;
