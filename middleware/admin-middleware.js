const express = require('express');

const isAdminUser = (req, res, next)=> {
    const role = req.userInfo.role;
    if(role !== 'admin') {
        return res.status(403).json({
            success: 'false',
            message: 'Access denied! Admin rights required',
        });
    }
    next();
}

module.exports = isAdminUser;