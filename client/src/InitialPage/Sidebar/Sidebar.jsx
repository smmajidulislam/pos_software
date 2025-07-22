import React, { useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { Link, useLocation } from "react-router-dom";
import { SidebarData } from "../../core/json/siderbar_data";
import HorizontalSidebar from "./horizontalSidebar";
import CollapsedSidebar from "./collapsedSidebar";

const Sidebar = () => {
  const location = useLocation();

  const [subOpen, setSubOpen] = useState("");
  const [subSidebar, setSubSidebar] = useState("");

  const toggleSidebar = (title) => {
    setSubOpen((prev) => (prev === title ? "" : title));
  };
  const toggleSubSidebar = (label) => {
    setSubSidebar((prev) => (prev === label ? "" : label));
  };

  return (
    <div>
      <div className="sidebar" id="sidebar">
        <Scrollbars>
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                {SidebarData?.map((mainLabel, index) => (
                  <li className="submenu-open" key={`main-${index}`}>
                    <h6 className="submenu-hdr">{mainLabel?.label}</h6>
                    <ul>
                      {mainLabel?.submenuItems?.map((title, i) => {
                        let linkArray = [];

                        title?.submenuItems?.forEach((link) => {
                          linkArray.push(link?.link);
                          if (link?.submenuItems) {
                            link?.submenuItems?.forEach((item) => {
                              linkArray.push(item?.link);
                            });
                          }
                        });

                        title.links = linkArray;

                        return (
                          <li className="submenu" key={`title-${i}`}>
                            <Link
                              to={title?.link}
                              onClick={() => toggleSidebar(title?.label)}
                              className={`${
                                subOpen === title?.label ? "subdrop" : ""
                              } ${
                                title?.links?.includes(location.pathname)
                                  ? "active"
                                  : ""
                              }`}
                            >
                              {title?.icon}
                              <span>{title?.label}</span>
                              {title?.submenuItems && (
                                <span className="menu-arrow" />
                              )}
                            </Link>

                            {title?.submenuItems && (
                              <ul
                                style={{
                                  display:
                                    subOpen === title?.label ? "block" : "none",
                                }}
                              >
                                {title?.submenuItems?.map((item, j) => (
                                  <li
                                    className="submenu submenu-two"
                                    key={`sub-${j}`}
                                  >
                                    <Link
                                      to={item?.link}
                                      className={`${
                                        item?.submenuItems
                                          ?.map((link) => link?.link)
                                          .includes(location.pathname) ||
                                        item?.link === location.pathname
                                          ? "active"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        toggleSubSidebar(item?.label)
                                      }
                                    >
                                      {item?.label}
                                      {item?.submenuItems && (
                                        <span className="menu-arrow" />
                                      )}
                                    </Link>

                                    {item?.submenuItems && (
                                      <ul
                                        style={{
                                          display:
                                            subSidebar === item?.label
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        {item?.submenuItems?.map(
                                          (subItem, k) => (
                                            <li key={`subsub-${k}`}>
                                              <Link
                                                to={subItem?.link}
                                                className={`${
                                                  subItem?.link ===
                                                    location.pathname ||
                                                  subItem?.submenuItems
                                                    ?.map(
                                                      (subLink) => subLink?.link
                                                    )
                                                    .includes(location.pathname)
                                                    ? "active"
                                                    : ""
                                                }`}
                                              >
                                                {subItem?.label}
                                              </Link>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Scrollbars>
      </div>

      <HorizontalSidebar />
      <CollapsedSidebar />
    </div>
  );
};

export default Sidebar;
