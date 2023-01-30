file(GLOB DS_FILES
    *.c
    network/*.c
    ../jacdac-c/jacdac/dist/c/jd_spec_pack.c
)

add_library(devicescript STATIC
    ${DS_FILES}
)

target_include_directories(devicescript PUBLIC
    .
)

target_link_libraries(devicescript PUBLIC jacdac)
