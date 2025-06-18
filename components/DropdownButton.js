import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

config.autoAddCss = false
library.add(fas, fab)
function DropdownButton({
  icon = null,
  text = 'Show menu',
  choices = [],
  onSelect = () => {},
  style = {},
  menuStyle = {},
  children
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open])

  const toggleMenu = event => {
    event.preventDefault()
    setOpen(prev => !prev)
  }

  const handleChoice = key => {
    setOpen(false)
    onSelect(key)
  }

  return (
    <div className='dropdownContainer'>
      {children ? (
        <div style={style} onClick={toggleMenu}>
          {children}
        </div>
      ) : (
        <button className='btn' onClick={toggleMenu} style={style}>
          <div className='btnIcon'>{icon && <FontAwesomeIcon icon={icon} />}</div>
          {text}
        </button>
      )}

      {open && (
        <div className='menu' ref={menuRef} style={menuStyle}>
          {choices.map(choice => (
            <button
              key={choice.key}
              className='choice'
              onClick={() => handleChoice(choice.key)}
            >
              {choice.icon && (
                <div className='btnIcon'>
                  <FontAwesomeIcon icon={choice.icon} prefix='fab' />
                </div>
              )}
              {choice.name}
            </button>
          ))}
        </div>
      )}
      <style jsx>{`
        .dropdownContainer {
          display: inline-block;
          vertical-align: middle;
          position: relative;
        }
        .btn {
          font-family: 'Open Sans', sans-serif;
          background: #7bc043;
          text-decoration: none;
          text-transform: uppercase;
          color: white;
          font-size: 14px;
          border-radius: 4px;
          border: none;
          display: inline-block;
          padding: 16px;
          padding-left: 24px;
          padding-right: 24px;
          outline: none;
          cursor: pointer;
        }
        .btnIcon {
          margin-right: 16px;
          display: inline;
        }
        .menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          display: flex;
          flex-direction: column;
          z-index: 2;
          background: white;
          box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          overflow: hidden;
          min-width: 100%;
        }
        .choice {
          font-family: 'Open Sans', sans-serif;
          background: white;
          text-decoration: none;
          text-transform: uppercase;
          color: #333;
          min-width: 200px;
          font-size: 14px;
          border: none;
          border-bottom: 1px solid #efefef;
          display: flex;
          padding: 16px;
          padding-left: 24px;
          padding-right: 24px;
          text-align: left;
          outline: none;
          cursor: pointer;
          flex-direction: row;
        }
        .choice:hover {
          background: #fafafa;
        }
        .choice:last-child {
          border-bottom: 0px;
        }
      `}</style>
    </div>
  )
}

export default DropdownButton
