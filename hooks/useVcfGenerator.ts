
import { useCallback } from 'react';
import { ContactData, Message } from '../types';

export const useVcfGenerator = () => {
    const generateAndDownloadVcf = useCallback((contact: ContactData, showMessage: (msg: Message) => void) => {
        try {
            const {
                fullName, firstName, lastName, prefix, organization, title,
                address, workPhone, mobilePhone, email, website
            } = contact;

            if (!fullName.trim() || !firstName.trim() || !lastName.trim()) {
                showMessage({ text: 'Full Name, First Name, and Last Name are required.', type: 'error' });
                return;
            }

            let street = '';
            let city = '';
            let postalCode = '';
            const addressParts = address.split(',').map(part => part.trim());
            if (addressParts.length >= 3) {
                street = addressParts[0];
                city = addressParts[1];
                postalCode = addressParts[2];
            } else if (addressParts.length === 2) {
                street = addressParts[0];
                city = addressParts[1];
            } else if (addressParts.length === 1 && addressParts[0] !== '') {
                street = addressParts[0];
            }

            let vcfContent = `BEGIN:VCARD\n`;
            vcfContent += `VERSION:3.0\n`;
            vcfContent += `FN:${fullName}\n`;
            vcfContent += `N:${lastName};${firstName};${prefix};;\n`;
            if (organization) vcfContent += `ORG:${organization}\n`;
            if (title) vcfContent += `TITLE:${title}\n`;
            if (street || city || postalCode) vcfContent += `ADR;TYPE=WORK:;;${street};${city};;${postalCode};\n`;
            if (workPhone) vcfContent += `TEL;TYPE=WORK,VOICE:${workPhone}\n`;
            if (mobilePhone) vcfContent += `TEL;TYPE=CELL,VOICE:${mobilePhone}\n`;
            if (email) vcfContent += `EMAIL;TYPE=INTERNET:${email}\n`;
            if (website) vcfContent += `URL:${website}\n`;
            vcfContent += `END:VCARD\n`;

            const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${firstName.toLowerCase() || 'contact'}_${lastName.toLowerCase() || 'generated'}.vcf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showMessage({ text: 'VCF file generated and downloaded successfully!', type: 'success' });

        } catch (error) {
            console.error('Error generating VCF file:', error);
            showMessage({ text: 'An unexpected error occurred while generating the file.', type: 'error' });
        }
    }, []);

    return { generateAndDownloadVcf };
};
