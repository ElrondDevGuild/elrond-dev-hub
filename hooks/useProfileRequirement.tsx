import {createContext, PropsWithChildren, useContext, useMemo, useState} from "react";
import {useAuth} from "./useAuth";
import {isProfileComplete} from "../utils/profile";
import Popup from "../components/shared/Dialog";
import Button from "../components/shared/Button";
import {useRouter} from "next/router";
import {profileSettingsPath} from "../utils/routes";

interface IContext {
    isComplete: boolean;
    showPopup: ({force}: { force?: boolean }) => void;
}

export const ProfileRequirementContext = createContext<IContext>({
    isComplete: true,
    showPopup: ({force = false}) => {}
});

export const ProfileRequirementContextProvider = ({children}: PropsWithChildren<{}>) => {
    const {user} = useAuth();
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [dismissed, setDismissed] = useState<boolean>(false);
    const router = useRouter();

    const showPopup = ({force = false}) => {
        if (dismissed && !force) {
            return;
        }
        setIsPopupOpen(true);
    };

    const dismissPopup = () => {
        setDismissed(true);
        setIsPopupOpen(false);
    }

    const value = useMemo(() => ({
        showPopup,
        isComplete: null === user ? true : isProfileComplete(user)
    }), [user]);

    return (
        <ProfileRequirementContext.Provider value={value}>
            {children}
            <Popup
                open={isPopupOpen}
                setOpen={setIsPopupOpen}
                title="Profile Incomplete"
                withCloseButton={false}
            >
                <div className="px-4">
                    <p className="">
                        Your profile is incomplete. Please complete it to be able to use the
                        bounties feature.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-4">
                        <Button
                            label="Update Profile"
                            extraClasses="w-full sm:w-40 justify-center"
                            onClick={async () => {
                                await router.push(profileSettingsPath);
                                setIsPopupOpen(false);
                            }}
                        />
                        <Button
                            label="Skip for now"
                            theme="secondary"
                            onClick={dismissPopup}
                            extraClasses="w-full sm:w-40 justify-center"
                        />
                    </div>
                </div>
            </Popup>
        </ProfileRequirementContext.Provider>
    );
};

export const useProfileRequirement = () => {
    const context = useContext(ProfileRequirementContext);
    if (context === undefined) {
        throw new Error(`useProfileRequirement must be used within a ProfileRequirementContext.`);
    }
    return context;
}