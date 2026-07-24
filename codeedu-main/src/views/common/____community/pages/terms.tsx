import CommunityLayout from "../layouts";

const Terms = () => {
    return (
        <CommunityLayout>
            <div className="w-full flex flex-col md:flex-row py-6 gap-5">
                <div>
                    <h2 className="mb-5">Posting Terms and Conditions</h2>
                    <ul className="list-disc pl-5 flex flex-col gap-4">
                        <li>
                            <strong>User Responsibility:</strong> You affirm that the content you post is your original work, or you have the right to share it. You are solely responsible for the content you publish.
                        </li>
                        <li>
                            <strong>Consent to Publish:</strong> You give {window.location.origin} permission to publish, display, and store your submitted content on our platform. This includes showing your post to other users, unless marked as private.
                        </li>
                        <li>
                            <strong>No Harmful or Illegal Content:</strong> You agree not to post content that is illegal, defamatory, harassing, hateful, or violates the rights of others, including copyright and privacy rights.
                        </li>
                        <li>
                            <strong>Right to Moderate:</strong> {window.location.origin} reserves the right to review, moderate, remove, or restrict access to any content that violates our guidelines or is reported by users.
                        </li>
                        <li>
                            <strong>Revocation and Deletion:</strong> You may request to edit or delete your post at any time. However, {window.location.origin} may retain backups for a reasonable period, in accordance with our data retention policy.
                        </li>
                        <li>
                            <strong>Content License:</strong> By posting, you grant {window.location.origin} a non-exclusive, royalty-free, worldwide license to use, display, and distribute your content for platform operation and promotion.
                        </li>
                        <li>
                            <strong>Changes to Terms:</strong> These terms may be updated from time to time. If material changes are made, we will notify you and obtain renewed consent if required.
                        </li>
                    </ul>
                </div>
            </div>
        </CommunityLayout>
    );
};

export default Terms;
