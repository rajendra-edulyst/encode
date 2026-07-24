import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { fetchCreateContent as createContentService } from '@/services/learner/CreateContentService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { IJodit } from 'jodit/esm/types/jodit';
import { tagSuggestion } from '@/services/learner/CommunityService';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { JoEditConfig } from '@/utils/joeditConfig';

const CreateContent = () => {
    const editorInstance = useRef<IJodit | null>(null);
    const editorConfig = useMemo(() => ({
        ...JoEditConfig,
        height: 250
    }), []);

    const handleEditorRef = (editor: IJodit) => {
        editorInstance.current = editor;
    };
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        category_id: '209',
        title: '',
        description: '',
        content_type: '16',
        post_type: '',
        status: 1,
        aspect_ratio: '',
        dimension: { height: 0, width: 0 },
        thumbnail: null,
        file: null,
        tag: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target;

        if (name == 'tag') {
            // check if , is pressed
            setFormData(prev => ({
                ...prev,
                tag: value
            }));
            if (value.includes(',')) {
                const tagValue = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                setTags(prev => [...prev, ...tagValue]);
                setFormData(prev => ({
                    ...prev,
                    tag: ''
                }));
            }
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async () => {
        // console.log(editorInstance?.current?.value);

        if (!formData.title || !formData.post_type) {
            setError('Please fill in all required fields');
            return;
        }

        if (formData.post_type === 'caravan' && !formData.file) {
            setError('Please upload a file for the reel/video/image post type');
            return;
        }
        setLoading(true);
        try {
            await createContentService({ ...formData, description: editorInstance?.current?.value, tag: tags.join(',') });
            navigate(`/community?tab=posts`);
        } catch (err) {
            setError('An error occurred');
            console.log(err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        tagSuggestion('209').then((tags) => {
            console.log(tags);
        }).catch((error) => {
            console.error('Error fetching tags:', error);
        });
    }, []);

    return (
        <Card>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <div>
                        <CardTitle>Community - Create Content</CardTitle>
                        <CardDescription>Create content for your community</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className='mb-3 border-t pt-3'>
                    <label className="block mb-2">Title</label>
                    <input type="text" name="title" placeholder='Enter title' value={formData.title} className="w-full p-2 border rounded" onChange={handleChange} />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-3'>
                    <div>
                        <label className="block mt-4 mb-2">Post Type</label>
                        <select name="post_type" value={formData.post_type} className="w-full p-3 border rounded" onChange={handleChange}>
                            <option value="">Select Post Type</option>
                            <option value="text">Blog</option>
                            <option value="text">Text</option>
                            <option value="caravan">Image</option>
                            <option value="caravan">Video</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mt-4 mb-2">Thumbnail</label>
                        <input type="file" name="thumbnail" className="w-full p-2 border rounded" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block mt-4 mb-2">File (Image/Video)</label>
                        <input type="file" accept="image/*,video/*" name="file" className="w-full p-2 border rounded" onChange={handleChange} />
                    </div>
                </div>
                <div className='mt-4 mb-2'>
                    <label className="block mb-2">Tags</label>
                    <input type="text" name="tag" placeholder='Enter tag with , seprated' className="w-full p-2 border rounded" autoComplete="off" value={formData.tag} onChange={handleChange} />
                    <div className='flex flex-wrap mt-2 gap-2'>
                        {
                            tags && tags?.map((tag, index) => (
                                <Badge key={index} variant="outline" className='flex justify-between items-center gap-2'>
                                    <span>{tag}</span>
                                    <X size={15}
                                        className='cursor-pointer'
                                        onClick={() => {
                                            setTags(prev => prev.filter((_, i) => i !== index));
                                        }}
                                    />
                                </Badge>
                            ))
                        }
                    </div>
                </div>
                <div>
                    <label className="block mb-2">Description</label>
                    <JoditEditor editorRef={handleEditorRef} value={formData.description} config={editorConfig} tabIndex={1} />
                </div>
                <div className="flex justify-end mt-4">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                        Cancel
                    </button>
                    <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleSubmit}>
                        {loading ? 'Creating...' : 'Create'}
                    </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </CardContent>
        </Card>
    );
};

export default memo(CreateContent);