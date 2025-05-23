interface LogoProps extends React.ComponentPropsWithoutRef<'div'> {}

const Logo = (props: LogoProps) => {
  return (
    <div {...props}>
      <img src="/logo.svg" alt="travellog logo" />
    </div>
  )
}

export default Logo
