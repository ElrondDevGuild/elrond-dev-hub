import React, {
    ComponentPropsWithRef,
    PropsWithChildren,
    ReactChildren, ReactElement,
    ReactFragment, ReactNode, useEffect,
    useState
} from "react";
import {classNames} from "../../utils/presentation";
import getFieldValue from "react-hook-form/dist/logic/getFieldValue";
import {ReactNodeArray} from "prop-types";

export default function Tabs(
    {
        children,
        onChange
    }: { onChange?: (tab: string) => void, children: ReactElement[] }
) {
    const [activeTab, setActiveTab] = useState(children[0].props.label);

    useEffect(() => {
        if (children.length) {
            setActiveTab(children[0].props.label);
        }
    }, []);

    useEffect(() => {
        if (typeof onChange === "function") {
            onChange(activeTab);
        }
    }, [activeTab]);

    return (
        <div className="flex flex-col items-center flex-grow">
            <div className="flex justify-start items-center space-x-2 w-full">
                {(children || []).map((child: any) => {
                    const label = child.props.label;
                    return (
                        <button
                            key={label}
                            className={classNames(
                                'py-2 uppercase text-sm',
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
};