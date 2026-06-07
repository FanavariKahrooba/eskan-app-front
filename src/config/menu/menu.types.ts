import type { LucideIcon } from "lucide-react";

export type RoleKey =
    | "super_admin"
    | "system_admin"
    | "organization_manager"
    | "shelter_manager"
    | "admission_operator"
    | "capacity_operator"
    | "field_inspector"
    | "finance_officer"
    | "report_analyst"
    | "support_operator"
    | "customer_support"
    | "integration_manager";

export type PermissionKey =
    | "dashboard.view"
    | "dashboard.executive.view"

    | "requests.view"
    | "requests.create"
    | "requests.edit"
    | "requests.cancel"
    | "requests.review"
    | "requests.referral.manage"

    | "shelter.dashboard.view"
    | "shelters.view"
    | "shelters.create"
    | "shelters.edit"
    | "shelters.delete"
    | "shelters.category.manage"
    | "shelters.facility.manage"
    | "shelters.capacity.manage"

    | "shelter.spaces.view"
    | "shelter.spaces.create"
    | "shelter.spaces.edit"
    | "shelter.spaces.delete"

    | "shelter.requests.view"
    | "shelter.requests.review"

    | "shelter.reservations.view"
    | "shelter.reservations.manage"

    | "map.view"
    | "map.manage"
    | "reservations.view"
    | "reservations.manage"
    | "capacity.queue.manage"

    | "decision_support.view"
    | "decision_support.manage"
    | "capacity.view"
    | "capacity.manage"

    | "applicants.view"
    | "applicants.manage"
    | "organizations.view"
    | "organizations.manage"
    | "crm.view"
    | "crm.manage"
    | "feedback.view"
    | "feedback.manage"

    | "storage.view"
    | "storage.manage"
    | "data_transfer.view"
    | "data_transfer.manage"
    | "data_sources.view"
    | "data_sources.manage"
    | "rejected_data.view"
    | "rejected_data.manage"

    | "branches.view"
    | "branches.manage"

    | "staff.view"
    | "staff.manage"
    | "attendance.view"
    | "attendance.manage"
    | "payroll.view"
    | "payroll.manage"

    | "finance.view"
    | "finance.manage"
    | "expenses.view"
    | "expenses.manage"
    | "transactions.view"
    | "transactions.manage"
    | "accounting.view"
    | "accounting.manage"

    | "reports.view"
    | "reports.export"

    | "ai.view"
    | "ai.manage"

    | "communications.view"
    | "communications.manage"
    | "notifications.view"
    | "notifications.manage"

    | "integrations.view"
    | "integrations.manage"
    | "api.view"
    | "api.manage"

    | "settings.view"
    | "settings.manage";

export type FeatureFlagKey =
    | "shelter_module"
    | "multi_branch"
    | "admission"
    | "reservation"
    | "capacity_queue"
    | "decision_support"
    | "emergency_mode"
    | "organizations"
    | "crm"
    | "storage"
    | "data_transfer"
    | "rejected_data_tracking"
    | "hr"
    | "payroll"
    | "advanced_finance"
    | "accounting"
    | "executive_dashboard"
    | "ai_assistant"
    | "communication_automation"
    | "integrations"
    | "public_api"
    | "advanced_reports"
    | "feedback_system";

export type BadgeVariant =
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "premium";

export interface MenuBadge {
    text: string;
    variant?: BadgeVariant;
}

export interface MenuMeta {
    permission?: PermissionKey | PermissionKey[];
    roles?: RoleKey[];
    featureFlag?: FeatureFlagKey | FeatureFlagKey[];
    badge?: MenuBadge;
    hidden?: boolean;
    disabled?: boolean;

    exact?: boolean;
    activePaths?: string[];
    keywords?: string[];
}

export interface BaseMenuNode extends MenuMeta {
    id: string;
    title: string;
    icon?: LucideIcon;
}

export interface MenuLeafItem extends BaseMenuNode {
    href: string;
    type: "item";
    path: string;
}

export interface MenuGroupItem extends BaseMenuNode {
    type: "group";
    children: MenuNode[];
    collapsible?: boolean;
    defaultOpen?: boolean;
}

export type MenuNode = MenuLeafItem | MenuGroupItem;

export interface MenuSection {
    id: string;
    title: string;
    children: MenuNode[];
}

export interface MenuAccessContext {
    permissions: PermissionKey[];
    roles: RoleKey[];
    featureFlags: FeatureFlagKey[];
    isSuperAdmin?: boolean;
}

export interface FlatMenuItem extends MenuLeafItem {
    sectionId: string;
    sectionTitle: string;
    groupId?: string;
    groupTitle?: string;
    breadcrumbs: string[];
    searchableText: string;
}

export interface ActiveMenuResult {
    item: FlatMenuItem;
    sectionId: string;
    sectionTitle: string;
    groupId?: string;
    groupTitle?: string;
    breadcrumbs: string[];
}
