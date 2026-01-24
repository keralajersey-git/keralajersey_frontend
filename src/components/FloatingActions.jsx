import React from 'react';

const FloatingActions = () => {
    const actions = [
        {
            id: 'whatsapp',
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            ),
            link: 'https://wa.me/919747140487',
            label: 'WhatsApp'
        },
        {
            id: 'call',
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z" />
                </svg>
            ),
            link: 'tel:+919747140487',
            label: 'Call'
        },
        {
            id: 'mail',
            icon: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
            ),
            link: 'mailto:keralajersey1@gmail.com',
            label: 'Email'
        }
    ];

    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-[9999]">
            {actions.map((action) => (
                <a
                    key={action.id}
                    href={action.link}
                    target={action.id === 'whatsapp' ? '_blank' : '_self'}
                    rel={action.id === 'whatsapp' ? 'noopener noreferrer' : ''}
                    className="group relative flex items-center justify-center w-14 h-14 rounded-full text-white bg-gray-900 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl active:scale-95 overflow-visible border border-white/10"
                    title={action.label}
                >
                    {action.icon}

                    {/* Tooltip/Label */}
                    <span className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-gray-900/90 backdrop-blur-md text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
                        {action.label}
                    </span>


                </a>
            ))}
        </div>
    );
};

export default FloatingActions;
