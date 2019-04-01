import { EntityFromIntegration } from "@jupiterone/jupiter-managed-integration-sdk";

export const USER_ENTITY_TYPE = "google_user";
export const USER_ENTITY_CLASS = "User";

export interface UserEntity extends EntityFromIntegration {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  mfaEnabled: boolean;
  suspended?: boolean;
  archived?: boolean;
  active: boolean;
  agreedToTerms?: boolean;
  changePasswordAtNextLogin?: boolean;
  creationTime?: string;
  customerId?: string;
  deletionTime?: string;
  gender?: string;
  hashFunction?: string;
  includeInGlobalAddressList?: boolean;
  ipWhitelisted?: boolean;
  isAdmin?: boolean;
  isDelegatedAdmin?: boolean;
  isEnforcedIn2Sv?: boolean;
  isEnrolledIn2Sv?: boolean;
  isMailboxSetup?: boolean;
  kind?: string;
  lastLoginTime?: string;
  orgUnitPath?: string;
  primaryEmail?: string;
  recoveryEmail?: string;
  recoveryPhone?: string;
  suspensionReason?: string;
  thumbnailPhotoEtag?: string;
  thumbnailPhotoUrl?: string;
  aliases?: string[];
}
