//
// Created by Aviad Hadad on 2018-12-02.
//

#pragma once

#include <stdint.h>
#include "glib.h"
#include <string.h>
#include <errno.h>
#include <stdlib.h>
#include <stdio.h>

void handle_error(GError* error);
void readfile(const char* filename);