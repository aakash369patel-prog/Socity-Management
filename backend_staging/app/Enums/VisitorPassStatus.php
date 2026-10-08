<?php

namespace App\Enums;

enum VisitorPassStatus: string
{
    case Active = 'active';
    case Expired = 'expired';
    case Revoked = 'revoked';
}
