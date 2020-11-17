import React from 'react'
import PropTypes from 'prop-types'
import {Link as RouterLink} from 'react-router-dom'
import {Link as MiLink} from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'

const Link = ({to, children, className, prefix, placement}) => (
  <Tooltip title={`${prefix} ${to}`} placement={placement}>
    <MiLink to={to} className={className} component={RouterLink}>
      {children}
    </MiLink>
  </Tooltip>
)

Link.propTypes = {
  to: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
  placement: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOf([PropTypes.string, PropTypes.node])
}

Link.defaultProps = {
  prefix: 'Перейти по',
  placement: 'bottom'
}

export default Link

