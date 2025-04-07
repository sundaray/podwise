// components/Divide.tsx
import React, { FunctionComponent } from "react";
import Burger, { BurgerProps } from "@/components/burger";

// Define the props type, omitting the render prop from BurgerProps
export interface DivideProps extends Omit<BurgerProps, "render" | "lines"> {}

function Divide(props: DivideProps) {
  return (
    <Burger
      {...props}
      render={(o) => (
        <div
          className="hamburger-react"
          aria-label={o.label}
          aria-expanded={o.isToggled}
          onClick={props.disabled ? undefined : o.handler}
          onKeyUp={
            props.disabled ? undefined : (e) => e.key === "Enter" && o.handler()
          }
          role="button"
          style={o.burgerStyles}
          tabIndex={0}
        >
          {/* Top bar left half */}
          <div
            style={{
              ...o.barStyles,
              width: `${o.width / 2}px`,
              borderRadius: `${o.barStyles.borderRadius} 0 0 ${o.barStyles.borderRadius}`,
              top: `${o.topOffset}px`,
              transition: `${o.time}s ${o.easing}`,
              transform: `${
                o.isToggled
                  ? `translate(${o.move * 0.48}px, ${o.move * 0.73}px) rotate(45deg)`
                  : "none"
              }`,
            }}
          />

          {/* Top bar right half */}
          <div
            style={{
              ...o.barStyles,
              width: `${o.width / 2}px`,
              borderRadius: `0 ${o.barStyles.borderRadius} ${o.barStyles.borderRadius} 0`,
              left: "50%",
              top: `${o.topOffset}px`,
              transition: `${o.time}s ${o.easing}`,
              transform: `${
                o.isToggled
                  ? `translate(-${o.move * 0.48}px, ${o.move * 0.73}px) rotate(-45deg)`
                  : "none"
              }`,
            }}
          />

          {/* Middle bar left half */}
          <div
            style={{
              ...o.barStyles,
              width: `${o.width / 2}px`,
              borderRadius: `${o.barStyles.borderRadius} 0 0 ${o.barStyles.borderRadius}`,
              top: `${o.topOffset + o.barHeight + o.margin}px`,
              transition: `${o.time}s ${o.easing}`,
              opacity: o.isToggled ? 0 : 1,
              transform: `${
                o.isToggled ? `translate(${-o.move * 1.25}px, 0)` : "none"
              }`,
            }}
          />

          {/* Middle bar right half */}
          <div
            style={{
              ...o.barStyles,
              width: `${o.width / 2}px`,
              borderRadius: `0 ${o.barStyles.borderRadius} ${o.barStyles.borderRadius} 0`,
              top: `${o.topOffset + o.barHeight + o.margin}px`,
              left: "50%",
              transition: `${o.time}s ${o.easing}`,
              opacity: o.isToggled ? 0 : 1,
              transform: `${
                o.isToggled ? `translate(${o.move * 1.25}px, 0)` : "none"
              }`,
            }}
          />

          {/* Bottom bar left half */}
          <div
            style={{
              ...o.barStyles,
              width: `${o.width / 2}px`,
              borderRadius: `${o.barStyles.borderRadius} 0 0 ${o.barStyles.borderRadius}`,
              top: `${o.topOffset + o.barHeight * 2 + o.margin * 2}px`,
              transition: `${o.time}s ${o.easing}`,
              transform: `${
                o.isToggled
                  ? `translate(${o.move * 0.48}px, -${o.move * 0.73}px) rotate(-45deg)`
                  : "none"
              }`,
            }}
          />

          {/* Bottom bar right half */}
          <div
            style={{
              ...o.barStyles,
              width: `${o.width / 2}px`,
              borderRadius: `0 ${o.barStyles.borderRadius} ${o.barStyles.borderRadius} 0`,
              left: "50%",
              top: `${o.topOffset + o.barHeight * 2 + o.margin * 2}px`,
              transition: `${o.time}s ${o.easing}`,
              transform: `${
                o.isToggled
                  ? `translate(-${o.move * 0.48}px, -${o.move * 0.73}px) rotate(45deg)`
                  : "none"
              }`,
            }}
          />
        </div>
      )}
    />
  );
}

export default Divide as FunctionComponent<DivideProps>;
