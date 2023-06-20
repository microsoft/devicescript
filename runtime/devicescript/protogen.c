// auto-generated!
#include "devs_internal.h"

#define PROP DEVS_BUILTIN_FLAG_IS_PROPERTY
#define ASYNC DEVS_BUILTIN_FLAG_ASYNC_CALL
#define NO_SELF DEVS_BUILTIN_FLAG_NO_SELF
#define CTOR DEVS_BUILTIN_FLAG_IS_CTOR

#define N(n) (DEVS_BUILTIN_STRING_##n)

// impl_array.c
value_t prop_Array_length(devs_ctx_t *ctx, value_t self);
void meth2_Array_insert(devs_ctx_t *ctx);
void fun1_Array_isArray(devs_ctx_t *ctx);
void methX_Array_push(devs_ctx_t *ctx);
void meth1_Array_pushRange(devs_ctx_t *ctx);
void methX_Array_slice(devs_ctx_t *ctx);
void meth1_Array_join(devs_ctx_t *ctx);
// impl_buffer.c
void fun1_Buffer_alloc(devs_ctx_t *ctx);
void fun1_Buffer_from(devs_ctx_t *ctx);
value_t prop_Buffer_length(devs_ctx_t *ctx, value_t self);
void meth1_Buffer_toString(devs_ctx_t *ctx);
void meth3_Buffer_fillAt(devs_ctx_t *ctx);
void meth4_Buffer_blitAt(devs_ctx_t *ctx);
void meth3_Buffer_indexOf(devs_ctx_t *ctx);
// impl_ds.c
void fun1_DeviceScript_sleep(devs_ctx_t *ctx);
void fun1_DeviceScript_delay(devs_ctx_t *ctx);
void fun1_DeviceScript__panic(devs_ctx_t *ctx);
void fun0_DeviceScript_reboot(devs_ctx_t *ctx);
void fun0_DeviceScript_restart(devs_ctx_t *ctx);
void funX_DeviceScript_format(devs_ctx_t *ctx);
void fun2_DeviceScript_print(devs_ctx_t *ctx);
void fun1_DeviceScript_parseFloat(devs_ctx_t *ctx);
void fun1_DeviceScript_parseInt(devs_ctx_t *ctx);
void fun2_DeviceScript__logRepr(devs_ctx_t *ctx);
void fun1_DeviceScript__dcfgString(devs_ctx_t *ctx);
void fun0_DeviceScript_millis(devs_ctx_t *ctx);
void fun1_DeviceScript_deviceIdentifier(devs_ctx_t *ctx);
void fun2_DeviceScript__serverSend(devs_ctx_t *ctx);
void fun2_DeviceScript__allocRole(devs_ctx_t *ctx);
void fun0_DeviceScript_notImplemented(devs_ctx_t *ctx);
void fun2_DeviceScript__twinMessage(devs_ctx_t *ctx);
// impl_dsi2c.c
void fun3_DeviceScript__i2cTransaction(devs_ctx_t *ctx);
// impl_dsspi.c
void fun5_DeviceScript_spiConfigure(devs_ctx_t *ctx);
void fun2_DeviceScript_spiXfer(devs_ctx_t *ctx);
void fun3_DeviceScript_spiSendImage(devs_ctx_t *ctx);
// impl_error.c
void meth1_Error___ctor__(devs_ctx_t *ctx);
void meth1_RangeError___ctor__(devs_ctx_t *ctx);
void meth1_TypeError___ctor__(devs_ctx_t *ctx);
void meth1_SyntaxError___ctor__(devs_ctx_t *ctx);
value_t prop_Error_name(devs_ctx_t *ctx, value_t self);
void meth0_Error_print(devs_ctx_t *ctx);
// impl_fiber.c
value_t prop_DsFiber_id(devs_ctx_t *ctx, value_t self);
value_t prop_DsFiber_suspended(devs_ctx_t *ctx, value_t self);
void meth1_DsFiber_resume(devs_ctx_t *ctx);
void meth0_DsFiber_terminate(devs_ctx_t *ctx);
void fun1_DeviceScript_suspend(devs_ctx_t *ctx);
void fun0_DsFiber_self(devs_ctx_t *ctx);
// impl_function.c
void methX_Function_start(devs_ctx_t *ctx);
value_t prop_Function_prototype(devs_ctx_t *ctx, value_t self);
value_t prop_Function_name(devs_ctx_t *ctx, value_t self);
// impl_gpio.c
value_t prop_GPIO_mode(devs_ctx_t *ctx, value_t self);
value_t prop_GPIO_capabilities(devs_ctx_t *ctx, value_t self);
value_t prop_GPIO_value(devs_ctx_t *ctx, value_t self);
void meth1_GPIO_setMode(devs_ctx_t *ctx);
void fun1_DeviceScript_gpio(devs_ctx_t *ctx);
// impl_image.c
value_t prop_Image_width(devs_ctx_t *ctx, value_t self);
value_t prop_Image_height(devs_ctx_t *ctx, value_t self);
value_t prop_Image_bpp(devs_ctx_t *ctx, value_t self);
value_t prop_Image_buffer(devs_ctx_t *ctx, value_t self);
void fun5_Image_alloc(devs_ctx_t *ctx);
void meth3_Image_set(devs_ctx_t *ctx);
void meth2_Image_get(devs_ctx_t *ctx);
void meth1_Image_fill(devs_ctx_t *ctx);
void meth5_Image_fillRect(devs_ctx_t *ctx);
void meth1_Image_equals(devs_ctx_t *ctx);
void meth0_Image_clone(devs_ctx_t *ctx);
void meth0_Image_flipX(devs_ctx_t *ctx);
void meth0_Image_flipY(devs_ctx_t *ctx);
void meth0_Image_transposed(devs_ctx_t *ctx);
void meth3_Image_drawImage(devs_ctx_t *ctx);
void meth4_Image_drawTransparentImage(devs_ctx_t *ctx);
void meth3_Image_overlapsWith(devs_ctx_t *ctx);
void meth5_Image_drawLine(devs_ctx_t *ctx);
void meth5_Image_blitRow(devs_ctx_t *ctx);
void meth11_Image_blit(devs_ctx_t *ctx);
void meth4_Image_fillCircle(devs_ctx_t *ctx);
// impl_json.c
void fun2_JSON_parse(devs_ctx_t *ctx);
void fun3_JSON_stringify(devs_ctx_t *ctx);
// impl_math.c
void fun1_Math_ceil(devs_ctx_t *ctx);
void fun1_Math_floor(devs_ctx_t *ctx);
void fun1_Math_round(devs_ctx_t *ctx);
void fun1_Math_abs(devs_ctx_t *ctx);
void fun0_Math_random(devs_ctx_t *ctx);
void fun1_Math_randomInt(devs_ctx_t *ctx);
void fun1_Math_log(devs_ctx_t *ctx);
void fun2_Math_pow(devs_ctx_t *ctx);
void fun2_Math_idiv(devs_ctx_t *ctx);
void fun2_Math_imod(devs_ctx_t *ctx);
void fun2_Math_imul(devs_ctx_t *ctx);
void fun2_Math_min(devs_ctx_t *ctx);
void fun2_Math_max(devs_ctx_t *ctx);
// impl_object.c
void fun2_Object_assign(devs_ctx_t *ctx);
void fun1_Object_keys(devs_ctx_t *ctx);
void fun1_Object_values(devs_ctx_t *ctx);
void fun2_Object_setPrototypeOf(devs_ctx_t *ctx);
// impl_packet.c
value_t prop_DsPacket_role(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_deviceIdentifier(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_shortId(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_serviceIndex(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_serviceCommand(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_flags(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_isCommand(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_isReport(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_payload(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_isEvent(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_eventCode(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_isRegSet(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_isRegGet(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_regCode(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_isAction(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacket_spec(devs_ctx_t *ctx, value_t self);
void meth0_DsPacket_decode(devs_ctx_t *ctx);
void meth0_DsPacket_notImplemented(devs_ctx_t *ctx);
// impl_packetspec.c
value_t prop_DsPacketSpec_parent(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacketSpec_name(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacketSpec_code(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacketSpec_response(devs_ctx_t *ctx, value_t self);
void methX_DsPacketSpec_encode(devs_ctx_t *ctx);
// impl_register.c
void meth0_DsRegister_read(devs_ctx_t *ctx);
void methX_DsRegister_write(devs_ctx_t *ctx);
value_t prop_DsPacketInfo_role(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacketInfo_name(devs_ctx_t *ctx, value_t self);
value_t prop_DsPacketInfo_code(devs_ctx_t *ctx, value_t self);
void methX_DsCommand___func__(devs_ctx_t *ctx);
// impl_role.c
value_t prop_DsRole_isBound(devs_ctx_t *ctx, value_t self);
value_t prop_DsRole_spec(devs_ctx_t *ctx, value_t self);
void meth2_DsRole_sendCommand(devs_ctx_t *ctx);
// impl_servicespec.c
value_t prop_DsServiceSpec_classIdentifier(devs_ctx_t *ctx, value_t self);
value_t prop_DsServiceSpec_name(devs_ctx_t *ctx, value_t self);
void meth1_DsServiceSpec_lookup(devs_ctx_t *ctx);
void meth1_DsServiceSpec_assign(devs_ctx_t *ctx);
// impl_socket.c
void fun2_DeviceScript__socketOpen(devs_ctx_t *ctx);
void fun0_DeviceScript__socketClose(devs_ctx_t *ctx);
void fun1_DeviceScript__socketWrite(devs_ctx_t *ctx);
// impl_string.c
value_t prop_String_length(devs_ctx_t *ctx, value_t self);
value_t prop_String_byteLength(devs_ctx_t *ctx, value_t self);
void meth1_String_charCodeAt(devs_ctx_t *ctx);
void meth1_String_charAt(devs_ctx_t *ctx);
void meth2_String_slice(devs_ctx_t *ctx);
void funX_String_fromCharCode(devs_ctx_t *ctx);
void meth3_String_indexOf(devs_ctx_t *ctx);
void meth0_String_toLowerCase(devs_ctx_t *ctx);
void meth0_String_toUpperCase(devs_ctx_t *ctx);

static const devs_builtin_proto_entry_t Array_prototype_entries[] = { //
    {N(LENGTH), 50000},                                               //
    {N(INSERT), 50001},                                               //
    {N(PUSH), 50003},                                                 //
    {N(PUSHRANGE), 50004},                                            //
    {N(SLICE), 50005},                                                //
    {N(JOIN), 50006},                                                 //
    {0, 0}};

static const devs_builtin_proto_entry_t Array_entries[] = { //
    {N(ISARRAY), 50002},                                    //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_ARRAY_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Buffer_entries[] = { //
    {N(ALLOC), 50007},                                       //
    {N(FROM), 50008},                                        //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Buffer_prototype_entries[] = { //
    {N(LENGTH), 50009},                                                //
    {N(TOSTRING), 50010},                                              //
    {N(FILLAT), 50011},                                                //
    {N(BLITAT), 50012},                                                //
    {N(INDEXOF), 50013},                                               //
    {0, 0}};

static const devs_builtin_proto_entry_t DeviceScript_entries[] = { //
    {N(SLEEP), 50014},                                             //
    {N(DELAY), 50015},                                             //
    {N(_PANIC), 50016},                                            //
    {N(REBOOT), 50017},                                            //
    {N(RESTART), 50018},                                           //
    {N(FORMAT), 50019},                                            //
    {N(PRINT), 50020},                                             //
    {N(PARSEFLOAT), 50021},                                        //
    {N(PARSEINT), 50022},                                          //
    {N(_LOGREPR), 50023},                                          //
    {N(_DCFGSTRING), 50024},                                       //
    {N(MILLIS), 50025},                                            //
    {N(DEVICEIDENTIFIER), 50026},                                  //
    {N(_SERVERSEND), 50027},                                       //
    {N(_ALLOCROLE), 50028},                                        //
    {N(NOTIMPLEMENTED), 50029},                                    //
    {N(_TWINMESSAGE), 50030},                                      //
    {N(_I2CTRANSACTION), 50031},                                   //
    {N(SPICONFIGURE), 50032},                                      //
    {N(SPIXFER), 50033},                                           //
    {N(SPISENDIMAGE), 50034},                                      //
    {N(SUSPEND), 50045},                                           //
    {N(GPIO), 50054},                                              //
    {N(_SOCKETOPEN), 50131},                                       //
    {N(_SOCKETCLOSE), 50132},                                      //
    {N(_SOCKETWRITE), 50133},                                      //
    {0, 0}};

static const devs_builtin_proto_entry_t TypeError_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50037},                                              //
    {0, 0}};

static const devs_builtin_proto_entry_t RangeError_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50036},                                               //
    {0, 0}};

static const devs_builtin_proto_entry_t Error_entries[] = { //
    {N(__FUNC__), 50035},                                   //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Error_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50035},                                          //
    {N(NAME), 50039},                                                 //
    {N(PRINT), 50040},                                                //
    {0, 0}};

static const devs_builtin_proto_entry_t RangeError_entries[] = { //
    {N(__FUNC__), 50036},                                        //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_RANGEERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t TypeError_entries[] = { //
    {N(__FUNC__), 50037},                                       //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_TYPEERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t SyntaxError_entries[] = { //
    {N(__FUNC__), 50038},                                         //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_SYNTAXERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t SyntaxError_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50038},                                                //
    {0, 0}};

static const devs_builtin_proto_entry_t DsFiber_prototype_entries[] = { //
    {N(ID), 50041},                                                     //
    {N(SUSPENDED), 50042},                                              //
    {N(RESUME), 50043},                                                 //
    {N(TERMINATE), 50044},                                              //
    {0, 0}};

static const devs_builtin_proto_entry_t DsFiber_entries[] = { //
    {N(SELF), 50046},                                         //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_DSFIBER_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Function_prototype_entries[] = { //
    {N(START), 50047},                                                   //
    {N(PROTOTYPE), 50048},                                               //
    {N(NAME), 50049},                                                    //
    {0, 0}};

static const devs_builtin_proto_entry_t GPIO_prototype_entries[] = { //
    {N(MODE), 50050},                                                //
    {N(CAPABILITIES), 50051},                                        //
    {N(VALUE), 50052},                                               //
    {N(SETMODE), 50053},                                             //
    {0, 0}};

static const devs_builtin_proto_entry_t Image_prototype_entries[] = { //
    {N(WIDTH), 50055},                                                //
    {N(HEIGHT), 50056},                                               //
    {N(BPP), 50057},                                                  //
    {N(BUFFER), 50058},                                               //
    {N(SET), 50060},                                                  //
    {N(GET), 50061},                                                  //
    {N(FILL), 50062},                                                 //
    {N(FILLRECT), 50063},                                             //
    {N(EQUALS), 50064},                                               //
    {N(CLONE), 50065},                                                //
    {N(FLIPX), 50066},                                                //
    {N(FLIPY), 50067},                                                //
    {N(TRANSPOSED), 50068},                                           //
    {N(DRAWIMAGE), 50069},                                            //
    {N(DRAWTRANSPARENTIMAGE), 50070},                                 //
    {N(OVERLAPSWITH), 50071},                                         //
    {N(DRAWLINE), 50072},                                             //
    {N(BLITROW), 50073},                                              //
    {N(BLIT), 50074},                                                 //
    {N(FILLCIRCLE), 50075},                                           //
    {0, 0}};

static const devs_builtin_proto_entry_t Image_entries[] = { //
    {N(ALLOC), 50059},                                      //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_IMAGE_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t JSON_entries[] = { //
    {N(PARSE), 50076},                                     //
    {N(STRINGIFY), 50077},                                 //
    {0, 0}};

static const devs_builtin_proto_entry_t Math_entries[] = { //
    {N(CEIL), 50078},                                      //
    {N(FLOOR), 50079},                                     //
    {N(ROUND), 50080},                                     //
    {N(ABS), 50081},                                       //
    {N(RANDOM), 50082},                                    //
    {N(RANDOMINT), 50083},                                 //
    {N(LOG), 50084},                                       //
    {N(POW), 50085},                                       //
    {N(IDIV), 50086},                                      //
    {N(IMOD), 50087},                                      //
    {N(IMUL), 50088},                                      //
    {N(MIN), 50089},                                       //
    {N(MAX), 50090},                                       //
    {0, 0}};

static const devs_builtin_proto_entry_t Object_entries[] = { //
    {N(ASSIGN), 50091},                                      //
    {N(KEYS), 50092},                                        //
    {N(VALUES), 50093},                                      //
    {N(SETPROTOTYPEOF), 50094},                              //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_OBJECT_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t DsPacket_prototype_entries[] = { //
    {N(ROLE), 50095},                                                    //
    {N(DEVICEIDENTIFIER), 50096},                                        //
    {N(SHORTID), 50097},                                                 //
    {N(SERVICEINDEX), 50098},                                            //
    {N(SERVICECOMMAND), 50099},                                          //
    {N(FLAGS), 50100},                                                   //
    {N(ISCOMMAND), 50101},                                               //
    {N(ISREPORT), 50102},                                                //
    {N(PAYLOAD), 50103},                                                 //
    {N(ISEVENT), 50104},                                                 //
    {N(EVENTCODE), 50105},                                               //
    {N(ISREGSET), 50106},                                                //
    {N(ISREGGET), 50107},                                                //
    {N(REGCODE), 50108},                                                 //
    {N(ISACTION), 50109},                                                //
    {N(SPEC), 50110},                                                    //
    {N(DECODE), 50111},                                                  //
    {N(NOTIMPLEMENTED), 50112},                                          //
    {0, 0}};

static const devs_builtin_proto_entry_t DsPacketSpec_prototype_entries[] = { //
    {N(PARENT), 50113},                                                      //
    {N(NAME), 50114},                                                        //
    {N(CODE), 50115},                                                        //
    {N(RESPONSE), 50116},                                                    //
    {N(ENCODE), 50117},                                                      //
    {0, 0}};

static const devs_builtin_proto_entry_t DsRegister_prototype_entries[] = { //
    {N(READ), 50118},                                                      //
    {N(WRITE), 50119},                                                     //
    {0, 0}};

static const devs_builtin_proto_entry_t DsCommand_prototype_entries[] = { //
    {N(__FUNC__), 50123},                                                 //
    {0, 0}};

static const devs_builtin_proto_entry_t DsEvent_prototype_entries[] = { //
    {0, 0}};

static const devs_builtin_proto_entry_t DsPacketInfo_prototype_entries[] = { //
    {N(ROLE), 50120},                                                        //
    {N(NAME), 50121},                                                        //
    {N(CODE), 50122},                                                        //
    {0, 0}};

static const devs_builtin_proto_entry_t DsRole_prototype_entries[] = { //
    {N(ISBOUND), 50124},                                               //
    {N(SPEC), 50125},                                                  //
    {N(SENDCOMMAND), 50126},                                           //
    {0, 0}};

static const devs_builtin_proto_entry_t DsServiceSpec_prototype_entries[] = { //
    {N(CLASSIDENTIFIER), 50127},                                              //
    {N(NAME), 50128},                                                         //
    {N(LOOKUP), 50129},                                                       //
    {N(ASSIGN), 50130},                                                       //
    {0, 0}};

static const devs_builtin_proto_entry_t String_prototype_entries[] = { //
    {N(LENGTH), 50134},                                                //
    {N(BYTELENGTH), 50135},                                            //
    {N(CHARCODEAT), 50136},                                            //
    {N(CHARAT), 50137},                                                //
    {N(SLICE), 50138},                                                 //
    {N(INDEXOF), 50140},                                               //
    {N(TOLOWERCASE), 50141},                                           //
    {N(TOUPPERCASE), 50142},                                           //
    {0, 0}};

static const devs_builtin_proto_entry_t String_entries[] = { //
    {N(FROMCHARCODE), 50139},                                //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t empty_entries[] = { //
    {0, 0}};

static const devs_builtin_proto_entry_t number_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_NUMBER_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t dsrole_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_DSROLE_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t function_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_FUNCTION_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t boolean_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_BOOLEAN_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t dspacket_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_DSPACKET_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t dsservicespec_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_DSSERVICESPEC_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t dspacketspec_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_DSPACKETSPEC_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t gpio_entries[] = { //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_GPIO_PROTOTYPE},    //
    {0, 0}};

const devs_builtin_proto_t devs_builtin_protos[DEVS_BUILTIN_OBJECT___MAX + 1] = {
    [DEVS_BUILTIN_OBJECT_ARRAY_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                             Array_prototype_entries},
    [DEVS_BUILTIN_OBJECT_ARRAY] = {DEVS_BUILTIN_PROTO_INIT, NULL, Array_entries},
    [DEVS_BUILTIN_OBJECT_BUFFER] = {DEVS_BUILTIN_PROTO_INIT, NULL, Buffer_entries},
    [DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                              Buffer_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DEVICESCRIPT] = {DEVS_BUILTIN_PROTO_INIT, NULL, DeviceScript_entries},
    [DEVS_BUILTIN_OBJECT_TYPEERROR_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE],
         TypeError_prototype_entries},
    [DEVS_BUILTIN_OBJECT_RANGEERROR_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE],
         RangeError_prototype_entries},
    [DEVS_BUILTIN_OBJECT_ERROR] = {DEVS_BUILTIN_PROTO_INIT, NULL, Error_entries},
    [DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                             Error_prototype_entries},
    [DEVS_BUILTIN_OBJECT_RANGEERROR] = {DEVS_BUILTIN_PROTO_INIT, NULL, RangeError_entries},
    [DEVS_BUILTIN_OBJECT_TYPEERROR] = {DEVS_BUILTIN_PROTO_INIT, NULL, TypeError_entries},
    [DEVS_BUILTIN_OBJECT_SYNTAXERROR] = {DEVS_BUILTIN_PROTO_INIT, NULL, SyntaxError_entries},
    [DEVS_BUILTIN_OBJECT_SYNTAXERROR_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                   SyntaxError_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSFIBER_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                               DsFiber_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSFIBER] = {DEVS_BUILTIN_PROTO_INIT, NULL, DsFiber_entries},
    [DEVS_BUILTIN_OBJECT_FUNCTION_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                Function_prototype_entries},
    [DEVS_BUILTIN_OBJECT_GPIO_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, GPIO_prototype_entries},
    [DEVS_BUILTIN_OBJECT_IMAGE_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                             Image_prototype_entries},
    [DEVS_BUILTIN_OBJECT_IMAGE] = {DEVS_BUILTIN_PROTO_INIT, NULL, Image_entries},
    [DEVS_BUILTIN_OBJECT_JSON] = {DEVS_BUILTIN_PROTO_INIT, NULL, JSON_entries},
    [DEVS_BUILTIN_OBJECT_MATH] = {DEVS_BUILTIN_PROTO_INIT, NULL, Math_entries},
    [DEVS_BUILTIN_OBJECT_OBJECT] = {DEVS_BUILTIN_PROTO_INIT, NULL, Object_entries},
    [DEVS_BUILTIN_OBJECT_DSPACKET_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                DsPacket_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSPACKETSPEC_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                    DsPacketSpec_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSREGISTER_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_DSPACKETINFO_PROTOTYPE],
         DsRegister_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSCOMMAND_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_DSPACKETINFO_PROTOTYPE],
         DsCommand_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSEVENT_PROTOTYPE] =
        {DEVS_BUILTIN_PROTO_INIT, &devs_builtin_protos[DEVS_BUILTIN_OBJECT_DSPACKETINFO_PROTOTYPE],
         DsEvent_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSPACKETINFO_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                    DsPacketInfo_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSROLE_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                              DsRole_prototype_entries},
    [DEVS_BUILTIN_OBJECT_DSSERVICESPEC_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                                     DsServiceSpec_prototype_entries},
    [DEVS_BUILTIN_OBJECT_STRING_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                              String_prototype_entries},
    [DEVS_BUILTIN_OBJECT_STRING] = {DEVS_BUILTIN_PROTO_INIT, NULL, String_entries},
    [DEVS_BUILTIN_OBJECT_NUMBER] = {DEVS_BUILTIN_PROTO_INIT, NULL, number_entries},
    [DEVS_BUILTIN_OBJECT_DSROLE] = {DEVS_BUILTIN_PROTO_INIT, NULL, dsrole_entries},
    [DEVS_BUILTIN_OBJECT_FUNCTION] = {DEVS_BUILTIN_PROTO_INIT, NULL, function_entries},
    [DEVS_BUILTIN_OBJECT_BOOLEAN] = {DEVS_BUILTIN_PROTO_INIT, NULL, boolean_entries},
    [DEVS_BUILTIN_OBJECT_DSPACKET] = {DEVS_BUILTIN_PROTO_INIT, NULL, dspacket_entries},
    [DEVS_BUILTIN_OBJECT_DSSERVICESPEC] = {DEVS_BUILTIN_PROTO_INIT, NULL, dsservicespec_entries},
    [DEVS_BUILTIN_OBJECT_DSPACKETSPEC] = {DEVS_BUILTIN_PROTO_INIT, NULL, dspacketspec_entries},
    [DEVS_BUILTIN_OBJECT_GPIO] = {DEVS_BUILTIN_PROTO_INIT, NULL, gpio_entries},
    [DEVS_BUILTIN_OBJECT_OBJECT_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
    [DEVS_BUILTIN_OBJECT_NUMBER_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
    [DEVS_BUILTIN_OBJECT_BOOLEAN_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
    [DEVS_BUILTIN_OBJECT_DSREPORT_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
};

uint16_t devs_num_builtin_functions = 143;
const devs_builtin_function_t devs_builtin_functions[143] = {
    {N(LENGTH), 0, PROP, {.prop = prop_Array_length}},
    {N(INSERT), 2, 0, {.meth = meth2_Array_insert}},
    {N(ISARRAY), 1, NO_SELF, {.meth = fun1_Array_isArray}},
    {N(PUSH), 0, 0, {.meth = methX_Array_push}},
    {N(PUSHRANGE), 1, 0, {.meth = meth1_Array_pushRange}},
    {N(SLICE), 0, 0, {.meth = methX_Array_slice}},
    {N(JOIN), 1, 0, {.meth = meth1_Array_join}},
    {N(ALLOC), 1, NO_SELF, {.meth = fun1_Buffer_alloc}},
    {N(FROM), 1, NO_SELF, {.meth = fun1_Buffer_from}},
    {N(LENGTH), 0, PROP, {.prop = prop_Buffer_length}},
    {N(TOSTRING), 1, 0, {.meth = meth1_Buffer_toString}},
    {N(FILLAT), 3, 0, {.meth = meth3_Buffer_fillAt}},
    {N(BLITAT), 4, 0, {.meth = meth4_Buffer_blitAt}},
    {N(INDEXOF), 3, 0, {.meth = meth3_Buffer_indexOf}},
    {N(SLEEP), 1, NO_SELF, {.meth = fun1_DeviceScript_sleep}},
    {N(DELAY), 1, NO_SELF, {.meth = fun1_DeviceScript_delay}},
    {N(_PANIC), 1, NO_SELF, {.meth = fun1_DeviceScript__panic}},
    {N(REBOOT), 0, NO_SELF, {.meth = fun0_DeviceScript_reboot}},
    {N(RESTART), 0, NO_SELF, {.meth = fun0_DeviceScript_restart}},
    {N(FORMAT), 0, NO_SELF, {.meth = funX_DeviceScript_format}},
    {N(PRINT), 2, NO_SELF, {.meth = fun2_DeviceScript_print}},
    {N(PARSEFLOAT), 1, NO_SELF, {.meth = fun1_DeviceScript_parseFloat}},
    {N(PARSEINT), 1, NO_SELF, {.meth = fun1_DeviceScript_parseInt}},
    {N(_LOGREPR), 2, NO_SELF, {.meth = fun2_DeviceScript__logRepr}},
    {N(_DCFGSTRING), 1, NO_SELF, {.meth = fun1_DeviceScript__dcfgString}},
    {N(MILLIS), 0, NO_SELF, {.meth = fun0_DeviceScript_millis}},
    {N(DEVICEIDENTIFIER), 1, NO_SELF, {.meth = fun1_DeviceScript_deviceIdentifier}},
    {N(_SERVERSEND), 2, NO_SELF, {.meth = fun2_DeviceScript__serverSend}},
    {N(_ALLOCROLE), 2, NO_SELF, {.meth = fun2_DeviceScript__allocRole}},
    {N(NOTIMPLEMENTED), 0, NO_SELF, {.meth = fun0_DeviceScript_notImplemented}},
    {N(_TWINMESSAGE), 2, NO_SELF, {.meth = fun2_DeviceScript__twinMessage}},
    {N(_I2CTRANSACTION), 3, NO_SELF, {.meth = fun3_DeviceScript__i2cTransaction}},
    {N(SPICONFIGURE), 5, NO_SELF, {.meth = fun5_DeviceScript_spiConfigure}},
    {N(SPIXFER), 2, NO_SELF, {.meth = fun2_DeviceScript_spiXfer}},
    {N(SPISENDIMAGE), 3, NO_SELF, {.meth = fun3_DeviceScript_spiSendImage}},
    {N(ERROR), 1, CTOR, {.meth = meth1_Error___ctor__}},
    {N(RANGEERROR), 1, CTOR, {.meth = meth1_RangeError___ctor__}},
    {N(TYPEERROR), 1, CTOR, {.meth = meth1_TypeError___ctor__}},
    {N(SYNTAXERROR), 1, CTOR, {.meth = meth1_SyntaxError___ctor__}},
    {N(NAME), 0, PROP, {.prop = prop_Error_name}},
    {N(PRINT), 0, 0, {.meth = meth0_Error_print}},
    {N(ID), 0, PROP, {.prop = prop_DsFiber_id}},
    {N(SUSPENDED), 0, PROP, {.prop = prop_DsFiber_suspended}},
    {N(RESUME), 1, 0, {.meth = meth1_DsFiber_resume}},
    {N(TERMINATE), 0, 0, {.meth = meth0_DsFiber_terminate}},
    {N(SUSPEND), 1, NO_SELF, {.meth = fun1_DeviceScript_suspend}},
    {N(SELF), 0, NO_SELF, {.meth = fun0_DsFiber_self}},
    {N(START), 0, 0, {.meth = methX_Function_start}},
    {N(PROTOTYPE), 0, PROP, {.prop = prop_Function_prototype}},
    {N(NAME), 0, PROP, {.prop = prop_Function_name}},
    {N(MODE), 0, PROP, {.prop = prop_GPIO_mode}},
    {N(CAPABILITIES), 0, PROP, {.prop = prop_GPIO_capabilities}},
    {N(VALUE), 0, PROP, {.prop = prop_GPIO_value}},
    {N(SETMODE), 1, 0, {.meth = meth1_GPIO_setMode}},
    {N(GPIO), 1, NO_SELF, {.meth = fun1_DeviceScript_gpio}},
    {N(WIDTH), 0, PROP, {.prop = prop_Image_width}},
    {N(HEIGHT), 0, PROP, {.prop = prop_Image_height}},
    {N(BPP), 0, PROP, {.prop = prop_Image_bpp}},
    {N(BUFFER), 0, PROP, {.prop = prop_Image_buffer}},
    {N(ALLOC), 5, NO_SELF, {.meth = fun5_Image_alloc}},
    {N(SET), 3, 0, {.meth = meth3_Image_set}},
    {N(GET), 2, 0, {.meth = meth2_Image_get}},
    {N(FILL), 1, 0, {.meth = meth1_Image_fill}},
    {N(FILLRECT), 5, 0, {.meth = meth5_Image_fillRect}},
    {N(EQUALS), 1, 0, {.meth = meth1_Image_equals}},
    {N(CLONE), 0, 0, {.meth = meth0_Image_clone}},
    {N(FLIPX), 0, 0, {.meth = meth0_Image_flipX}},
    {N(FLIPY), 0, 0, {.meth = meth0_Image_flipY}},
    {N(TRANSPOSED), 0, 0, {.meth = meth0_Image_transposed}},
    {N(DRAWIMAGE), 3, 0, {.meth = meth3_Image_drawImage}},
    {N(DRAWTRANSPARENTIMAGE), 4, 0, {.meth = meth4_Image_drawTransparentImage}},
    {N(OVERLAPSWITH), 3, 0, {.meth = meth3_Image_overlapsWith}},
    {N(DRAWLINE), 5, 0, {.meth = meth5_Image_drawLine}},
    {N(BLITROW), 5, 0, {.meth = meth5_Image_blitRow}},
    {N(BLIT), 11, 0, {.meth = meth11_Image_blit}},
    {N(FILLCIRCLE), 4, 0, {.meth = meth4_Image_fillCircle}},
    {N(PARSE), 2, NO_SELF, {.meth = fun2_JSON_parse}},
    {N(STRINGIFY), 3, NO_SELF, {.meth = fun3_JSON_stringify}},
    {N(CEIL), 1, NO_SELF, {.meth = fun1_Math_ceil}},
    {N(FLOOR), 1, NO_SELF, {.meth = fun1_Math_floor}},
    {N(ROUND), 1, NO_SELF, {.meth = fun1_Math_round}},
    {N(ABS), 1, NO_SELF, {.meth = fun1_Math_abs}},
    {N(RANDOM), 0, NO_SELF, {.meth = fun0_Math_random}},
    {N(RANDOMINT), 1, NO_SELF, {.meth = fun1_Math_randomInt}},
    {N(LOG), 1, NO_SELF, {.meth = fun1_Math_log}},
    {N(POW), 2, NO_SELF, {.meth = fun2_Math_pow}},
    {N(IDIV), 2, NO_SELF, {.meth = fun2_Math_idiv}},
    {N(IMOD), 2, NO_SELF, {.meth = fun2_Math_imod}},
    {N(IMUL), 2, NO_SELF, {.meth = fun2_Math_imul}},
    {N(MIN), 2, NO_SELF, {.meth = fun2_Math_min}},
    {N(MAX), 2, NO_SELF, {.meth = fun2_Math_max}},
    {N(ASSIGN), 2, NO_SELF, {.meth = fun2_Object_assign}},
    {N(KEYS), 1, NO_SELF, {.meth = fun1_Object_keys}},
    {N(VALUES), 1, NO_SELF, {.meth = fun1_Object_values}},
    {N(SETPROTOTYPEOF), 2, NO_SELF, {.meth = fun2_Object_setPrototypeOf}},
    {N(ROLE), 0, PROP, {.prop = prop_DsPacket_role}},
    {N(DEVICEIDENTIFIER), 0, PROP, {.prop = prop_DsPacket_deviceIdentifier}},
    {N(SHORTID), 0, PROP, {.prop = prop_DsPacket_shortId}},
    {N(SERVICEINDEX), 0, PROP, {.prop = prop_DsPacket_serviceIndex}},
    {N(SERVICECOMMAND), 0, PROP, {.prop = prop_DsPacket_serviceCommand}},
    {N(FLAGS), 0, PROP, {.prop = prop_DsPacket_flags}},
    {N(ISCOMMAND), 0, PROP, {.prop = prop_DsPacket_isCommand}},
    {N(ISREPORT), 0, PROP, {.prop = prop_DsPacket_isReport}},
    {N(PAYLOAD), 0, PROP, {.prop = prop_DsPacket_payload}},
    {N(ISEVENT), 0, PROP, {.prop = prop_DsPacket_isEvent}},
    {N(EVENTCODE), 0, PROP, {.prop = prop_DsPacket_eventCode}},
    {N(ISREGSET), 0, PROP, {.prop = prop_DsPacket_isRegSet}},
    {N(ISREGGET), 0, PROP, {.prop = prop_DsPacket_isRegGet}},
    {N(REGCODE), 0, PROP, {.prop = prop_DsPacket_regCode}},
    {N(ISACTION), 0, PROP, {.prop = prop_DsPacket_isAction}},
    {N(SPEC), 0, PROP, {.prop = prop_DsPacket_spec}},
    {N(DECODE), 0, 0, {.meth = meth0_DsPacket_decode}},
    {N(NOTIMPLEMENTED), 0, 0, {.meth = meth0_DsPacket_notImplemented}},
    {N(PARENT), 0, PROP, {.prop = prop_DsPacketSpec_parent}},
    {N(NAME), 0, PROP, {.prop = prop_DsPacketSpec_name}},
    {N(CODE), 0, PROP, {.prop = prop_DsPacketSpec_code}},
    {N(RESPONSE), 0, PROP, {.prop = prop_DsPacketSpec_response}},
    {N(ENCODE), 0, 0, {.meth = methX_DsPacketSpec_encode}},
    {N(READ), 0, 0, {.meth = meth0_DsRegister_read}},
    {N(WRITE), 0, 0, {.meth = methX_DsRegister_write}},
    {N(ROLE), 0, PROP, {.prop = prop_DsPacketInfo_role}},
    {N(NAME), 0, PROP, {.prop = prop_DsPacketInfo_name}},
    {N(CODE), 0, PROP, {.prop = prop_DsPacketInfo_code}},
    {N(__FUNC__), 0, 0, {.meth = methX_DsCommand___func__}},
    {N(ISBOUND), 0, PROP, {.prop = prop_DsRole_isBound}},
    {N(SPEC), 0, PROP, {.prop = prop_DsRole_spec}},
    {N(SENDCOMMAND), 2, 0, {.meth = meth2_DsRole_sendCommand}},
    {N(CLASSIDENTIFIER), 0, PROP, {.prop = prop_DsServiceSpec_classIdentifier}},
    {N(NAME), 0, PROP, {.prop = prop_DsServiceSpec_name}},
    {N(LOOKUP), 1, 0, {.meth = meth1_DsServiceSpec_lookup}},
    {N(ASSIGN), 1, 0, {.meth = meth1_DsServiceSpec_assign}},
    {N(_SOCKETOPEN), 2, NO_SELF, {.meth = fun2_DeviceScript__socketOpen}},
    {N(_SOCKETCLOSE), 0, NO_SELF, {.meth = fun0_DeviceScript__socketClose}},
    {N(_SOCKETWRITE), 1, NO_SELF, {.meth = fun1_DeviceScript__socketWrite}},
    {N(LENGTH), 0, PROP, {.prop = prop_String_length}},
    {N(BYTELENGTH), 0, PROP, {.prop = prop_String_byteLength}},
    {N(CHARCODEAT), 1, 0, {.meth = meth1_String_charCodeAt}},
    {N(CHARAT), 1, 0, {.meth = meth1_String_charAt}},
    {N(SLICE), 2, 0, {.meth = meth2_String_slice}},
    {N(FROMCHARCODE), 0, NO_SELF, {.meth = funX_String_fromCharCode}},
    {N(INDEXOF), 3, 0, {.meth = meth3_String_indexOf}},
    {N(TOLOWERCASE), 0, 0, {.meth = meth0_String_toLowerCase}},
    {N(TOUPPERCASE), 0, 0, {.meth = meth0_String_toUpperCase}}};

STATIC_ASSERT(11 <= DEVS_BUILTIN_MAX_ARGS);
STATIC_ASSERT(50000 == DEVS_FIRST_BUILTIN_FUNCTION);
