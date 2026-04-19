/**
 * Map a User lean doc (influencer role + details) to the card/list DTO used by brand UI.
 */
export type InfluencerCardDto = {
  id: string;
  name: string;
  niche: string;
  niches?: string[];
  followers: string;
  rate: string;
  profilePic: string | null;
  email?: string;
};

export function userLeanToInfluencerDto(influencer: Record<string, unknown>): InfluencerCardDto {
  const d = (influencer.details as Record<string, unknown> | undefined) || {};
  const firstName = (d.firstName as string) || "";
  const lastName = (d.lastName as string) || "";
  const fullName = `${firstName} ${lastName}`.trim() || (influencer.name as string) || "";
  const niches = Array.isArray(d.niche) && (d.niche as string[]).length > 0 ? (d.niche as string[]) : [];
  const niche = niches.length > 0 ? niches[0] : "";
  const socials = d.socials as { instagram?: { followers?: string } } | undefined;
  const instagramFollowers = socials?.instagram?.followers || "0";
  const estimatedRate = (d.estimatedRate as string) || "Not specified";
  const profilePic = (d.profilePic as string) || null;
  const _id = influencer._id as { toString(): string };

  return {
    id: _id.toString(),
    name: fullName,
    niche,
    niches,
    followers: instagramFollowers,
    rate: estimatedRate,
    profilePic,
    email: influencer.email as string | undefined,
  };
}
