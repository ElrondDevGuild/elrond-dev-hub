import React, {PropsWithChildren, useState} from "react";
import {classNames} from "../../utils/presentation";

export default function Tabs({children}: PropsWithChildren<any>) {
    const [activeTab, setActiveTab] = useState(children[0].props.label);

    return (
        <div className="flex flex-col items-center flex-grow">
            <div className="flex justify-start items-center space-x-2 w-full">
                {children.map((child: any) => {
                    const label = child.props.label;
                    return (
                        <button
                            key={label}
                            className={classNames(
                                'px-1 py-2 uppercase text-sm',
                                activeTab === label ? 'text-primary dark:text-primary-dark' : 'text-theme-text dark:text-theme-text-dark',
                            )}
                            onClick={() => setActiveTab(label)}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
            <hr className="w-full h-0.5 bg-theme-border dark:bg-theme-border-dark mt-1 mb-5"/>
            <div className="flex-grow w-full ">
                {children.map((child: any) => {
                    if (child.props.label === activeTab) return child.props.children;
                })}
            </div>
        </div>
    );
}