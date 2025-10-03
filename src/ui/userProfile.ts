
import { UserData } from '../types';

const ICONS = {
    edit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`
};

/**
 * Renders the user profile summary widget for the main dashboard.
 * @param userData - The user's data object.
 * @returns HTML string for the profile widget.
 */
export const renderUserProfileWidget = (userData: UserData): string => {
    const profile = userData.step1 || {};

    return `
        <div class="profile-widget card animate-fade-in-up" style="animation-delay: 700ms;">
            <h3 class="card-header">
                پروفایل ورزشی
                <button id="edit-dashboard-profile-btn" class="edit-btn" title="ویرایش کامل پروفایل">
                    ${ICONS.edit}
                </button>
            </h3>
            <div class="card-content grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div class="info-item"><strong>قد:</strong> <span>${profile.height || 'ثبت نشده'} cm</span></div>
                <div class="info-item"><strong>وزن:</strong> <span>${profile.weight || 'ثبت نشده'} kg</span></div>
                <div class="info-item col-span-2"><strong>هدف:</strong> <span>${profile.trainingGoal || 'ثبت نشده'}</span></div>
                <div class="info-item col-span-2"><strong>محدودیت‌ها:</strong> <p class="text-xs text-text-secondary truncate">${profile.limitations || 'ثبت نشده'}</p></div>
            </div>
        </div>
    `;
};
