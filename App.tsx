
import React, { useState, useCallback } from 'react';
import { Cat, Download, RotateCcw, Sparkles } from 'lucide-react';
import FormField from './components/FormField';
import Spinner from './components/Spinner';
import MessageBox from './components/MessageBox';
import { parseSignatureWithGemini } from './services/geminiService';
import { useVcfGenerator } from './hooks/useVcfGenerator';
import { INITIAL_CONTACT_DATA, EMPTY_CONTACT_DATA } from './constants';
import { ContactData, Message } from './types';

const App: React.FC = () => {
    const [signature, setSignature] = useState('');
    const [contactData, setContactData] = useState<ContactData>(INITIAL_CONTACT_DATA);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<Message | null>(null);

    const { generateAndDownloadVcf } = useVcfGenerator();

    const showMessage = useCallback((msg: Message) => {
        setMessage(msg);
        setTimeout(() => setMessage(null), 5000);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactData(prev => ({ ...prev, [name]: value }));
    };

    const handleParseSignature = async () => {
        if (!signature.trim()) {
            showMessage({ text: 'Please paste a signature into the text area.', type: 'error' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const data = await parseSignatureWithGemini(signature);
            setContactData(data);
            showMessage({ text: 'Signature parsed successfully! Please review the fields.', type: 'success' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            showMessage({ text: errorMessage, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerate = () => {
        generateAndDownloadVcf(contactData, showMessage);
    };
    
    const handleReset = () => {
        setSignature('');
        setContactData(EMPTY_CONTACT_DATA);
        showMessage({ text: 'All fields have been reset.', type: 'info' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <div className="flex justify-center mb-4">
                    <Cat className="w-12 h-12 text-gray-700" />
                </div>

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">VCF Contact Generator</h1>
                <p className="text-center text-gray-600 mb-8">
                    Fill the fields, use the default data, or paste an email signature to create a VCF file.
                </p>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <label htmlFor="signatureInput" className="block text-sm font-medium text-gray-700 mb-2">
                        Paste Email Signature Here:
                    </label>
                    <textarea 
                        id="signatureInput" 
                        rows={6}
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Copy and paste an email signature here."
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleParseSignature}
                        disabled={isLoading}
                        className="mt-2 w-full bg-purple-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center disabled:bg-purple-400 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <Spinner />
                                <span className="ml-2">Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                <span>Smart Parse (Gemini)</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="space-y-4">
                    <FormField id="fullName" label="Full Name" value={contactData.fullName} onChange={handleInputChange} />
                    <FormField id="firstName" label="First Name" value={contactData.firstName} onChange={handleInputChange} />
                    <FormField id="lastName" label="Last Name" value={contactData.lastName} onChange={handleInputChange} />
                    <FormField id="prefix" label="Prefix / Title (e.g., Dr.)" value={contactData.prefix} onChange={handleInputChange} />
                    <FormField id="organization" label="Organization" value={contactData.organization} onChange={handleInputChange} />
                    <FormField id="title" label="Job Title" value={contactData.title} onChange={handleInputChange} />
                    <FormField id="address" label="Address (Street, City, ZIP)" value={contactData.address} onChange={handleInputChange} placeholder="Street, City, ZIP" />
                    <FormField id="workPhone" label="Work Phone" type="tel" value={contactData.workPhone} onChange={handleInputChange} />
                    <FormField id="mobilePhone" label="Mobile Phone" type="tel" value={contactData.mobilePhone} onChange={handleInputChange} />
                    <FormField id="email" label="Email" type="email" value={contactData.email} onChange={handleInputChange} />
                    <FormField id="website" label="Website" type="url" value={contactData.website} onChange={handleInputChange} />
                </div>

                <MessageBox message={message} />
                
                <div className="mt-8 flex flex-col space-y-3">
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center disabled:bg-blue-400 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        <Download className="w-5 h-5 mr-2" /> Download VCF File
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={isLoading}
                        className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg shadow-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        <RotateCcw className="w-5 h-5 mr-2" /> Reset All Fields
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
