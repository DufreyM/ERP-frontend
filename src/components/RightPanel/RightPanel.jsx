import './RightPanel.css';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const RightPanel = ({collapsed, setCollapsed}) => {

    return (
        <div className={`right-panel ${collapsed ? 'collapsed' : ''}`}>
            <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? <FaChevronLeft /> : <FaChevronRight />}
            </button>

            {!collapsed && (
                <>
                    <div className="panel-section">
                        <div className="panel-header">Notificaciones</div>
                        <div className="panel-content"></div>
                    </div>
                    <div className="panel-section">
                        <div className="panel-header">Por hacer</div>
                        <div className="panel-content"></div>
                    </div>
                </>
            )}
        </div>
    );
};

export default RightPanel;
