// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry {
    struct Certificate {
        bytes32 dataHash;
        uint256 timestamp;
        address issuer;
        bool isValid;
    }

    mapping(string => Certificate) public certificates; // Maps certificate ID to Certificate
    address public admin;

    event CertificateStored(string indexed certificateId, bytes32 indexed dataHash, uint256 timestamp);
    event CertificateRevoked(string indexed certificateId, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function storeCertificate(string memory _certificateId, string memory _hash) public onlyAdmin {
        require(!certificates[_certificateId].isValid, "Certificate ID already exists");
        
        // Use keccak256 hash or directly store the hash string (assuming SHA256 was generated off-chain)
        // Here we store the offchain generated SHA256 string by hashing it into bytes32 to save space
        bytes32 hashedData = keccak256(abi.encodePacked(_hash));
        
        certificates[_certificateId] = Certificate({
            dataHash: hashedData,
            timestamp: block.timestamp,
            issuer: msg.sender,
            isValid: true
        });

        emit CertificateStored(_certificateId, hashedData, block.timestamp);
    }

    function verifyCertificate(string memory _certificateId, string memory _hash) public view returns (bool) {
        Certificate memory cert = certificates[_certificateId];
        if (!cert.isValid) {
            return false;
        }

        bytes32 hashedData = keccak256(abi.encodePacked(_hash));
        return cert.dataHash == hashedData;
    }

    function revokeCertificate(string memory _certificateId) public onlyAdmin {
        require(certificates[_certificateId].isValid, "Certificate not found or already invalid");
        certificates[_certificateId].isValid = false;
        
        emit CertificateRevoked(_certificateId, block.timestamp);
    }
}
