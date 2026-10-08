<?php

namespace App\Enums;

enum VisitorStatus: string
{
    case Entered = 'entered';
    case Exited = 'exited';
}
