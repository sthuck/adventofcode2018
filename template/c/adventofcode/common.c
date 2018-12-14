//
// Created by Aviad Hadad on 2018-12-02.
//

#include "common.h"

void handle_error(GError* error) {
    printf("Error occurred! code: %d, msg: %s", error->code, error->message);
    exit(-1);
}

void readfile(const char* filename) {
    GArray* line_array = g_array_sized_new(TRUE, TRUE, sizeof(gchar*), 100);
    g_array_set_clear_func(line_array, &g_free);
    char* content = g_new0(gchar, 1024*1024*1000); //1k line, 1000 lines;
    GError* error = NULL;
    gboolean success = g_file_get_contents(filename, &content, NULL, &error);
    if(error) {
        handle_error(error);
    }
    g_assert(success);
    fprintf(stdout, "%s", content);
}
