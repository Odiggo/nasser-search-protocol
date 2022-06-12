export type SearchContracts = {
  "version": "0.1.0",
  "name": "search_contracts",
  "instructions": [
    {
      "name": "initResource",
      "accounts": [
        {
          "name": "resource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ix",
          "type": {
            "defined": "InitResourceIx"
          }
        }
      ]
    },
    {
      "name": "initSession",
      "accounts": [
        {
          "name": "session",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "resource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "startSession",
      "accounts": [
        {
          "name": "session",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "resource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "endSession",
      "accounts": [
        {
          "name": "session",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "resource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "resource",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "uuid",
            "type": "string"
          },
          {
            "name": "chargeAmount",
            "type": "u64"
          },
          {
            "name": "chargeDivisor",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "escrow",
            "type": "publicKey"
          },
          {
            "name": "activeSessions",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "session",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "resource",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "lastUpdateAt",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitResourceIx",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "uuid",
            "type": "string"
          },
          {
            "name": "chargeAmount",
            "type": "u64"
          },
          {
            "name": "chargeDivisor",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidEscrow",
      "msg": "Invalid resource"
    },
    {
      "code": 6001,
      "name": "InvalidResource",
      "msg": "Invalid escrow"
    },
    {
      "code": 6002,
      "name": "InvalidAuthority",
      "msg": "Invalid authority"
    },
    {
      "code": 6003,
      "name": "SessionAlreadyActive",
      "msg": "Session is already active"
    },
    {
      "code": 6004,
      "name": "SessionNotActive",
      "msg": "Session is not active"
    }
  ]
};

export const IDL: SearchContracts = {
  "version": "0.1.0",
  "name": "search_contracts",
  "instructions": [
    {
      "name": "initResource",
      "accounts": [
        {
          "name": "resource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "ix",
          "type": {
            "defined": "InitResourceIx"
          }
        }
      ]
    },
    {
      "name": "initSession",
      "accounts": [
        {
          "name": "session",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "resource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "startSession",
      "accounts": [
        {
          "name": "session",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "resource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "endSession",
      "accounts": [
        {
          "name": "session",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "resource",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "resource",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "uuid",
            "type": "string"
          },
          {
            "name": "chargeAmount",
            "type": "u64"
          },
          {
            "name": "chargeDivisor",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "escrow",
            "type": "publicKey"
          },
          {
            "name": "activeSessions",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "session",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "resource",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "lastUpdateAt",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitResourceIx",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "uuid",
            "type": "string"
          },
          {
            "name": "chargeAmount",
            "type": "u64"
          },
          {
            "name": "chargeDivisor",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidEscrow",
      "msg": "Invalid resource"
    },
    {
      "code": 6001,
      "name": "InvalidResource",
      "msg": "Invalid escrow"
    },
    {
      "code": 6002,
      "name": "InvalidAuthority",
      "msg": "Invalid authority"
    },
    {
      "code": 6003,
      "name": "SessionAlreadyActive",
      "msg": "Session is already active"
    },
    {
      "code": 6004,
      "name": "SessionNotActive",
      "msg": "Session is not active"
    }
  ]
};
