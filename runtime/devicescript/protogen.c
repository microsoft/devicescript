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
void methX_Array___ctor__(devs_ctx_t *ctx);
void methX_Array_push(devs_ctx_t *ctx);
void meth1_Array_pushRange(devs_ctx_t *ctx);
void methX_Array_slice(devs_ctx_t *ctx);
void meth1_Array_join(devs_ctx_t *ctx);
// impl_buffer.c
void fun1_Buffer_alloc(devs_ctx_t *ctx);
void fun2_Buffer_from(devs_ctx_t *ctx);
value_t prop_Buffer_length(devs_ctx_t *ctx, value_t self);
void meth1_Buffer_toString(devs_ctx_t *ctx);
void meth3_Buffer_fillAt(devs_ctx_t *ctx);
void meth4_Buffer_blitAt(devs_ctx_t *ctx);
void meth3_Buffer_indexOf(devs_ctx_t *ctx);
void meth0_Buffer_fillRandom(devs_ctx_t *ctx);
void meth4_Buffer_encrypt(devs_ctx_t *ctx);
void fun3_Buffer_digest(devs_ctx_t *ctx);
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
// impl_dsled.c
void fun2_DeviceScript_ledStripSend(devs_ctx_t *ctx);
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
void meth1_Object___ctor__(devs_ctx_t *ctx);
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
    {N(CONSTRUCTOR), 50003},                                          //
    {N(PUSH), 50004},                                                 //
    {N(PUSHRANGE), 50005},                                            //
    {N(SLICE), 50006},                                                //
    {N(JOIN), 50007},                                                 //
    {0, 0}};

static const devs_builtin_proto_entry_t Array_entries[] = { //
    {N(ISARRAY), 50002},                                    //
    {N(__FUNC__), 50003},                                   //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_ARRAY_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Buffer_entries[] = { //
    {N(ALLOC), 50008},                                       //
    {N(FROM), 50009},                                        //
    {N(DIGEST), 50017},                                      //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_BUFFER_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Buffer_prototype_entries[] = { //
    {N(LENGTH), 50010},                                                //
    {N(TOSTRING), 50011},                                              //
    {N(FILLAT), 50012},                                                //
    {N(BLITAT), 50013},                                                //
    {N(INDEXOF), 50014},                                               //
    {N(FILLRANDOM), 50015},                                            //
    {N(ENCRYPT), 50016},                                               //
    {0, 0}};

static const devs_builtin_proto_entry_t DeviceScript_entries[] = { //
    {N(SLEEP), 50018},                                             //
    {N(DELAY), 50019},                                             //
    {N(_PANIC), 50020},                                            //
    {N(REBOOT), 50021},                                            //
    {N(RESTART), 50022},                                           //
    {N(FORMAT), 50023},                                            //
    {N(PRINT), 50024},                                             //
    {N(PARSEFLOAT), 50025},                                        //
    {N(PARSEINT), 50026},                                          //
    {N(_LOGREPR), 50027},                                          //
    {N(_DCFGSTRING), 50028},                                       //
    {N(MILLIS), 50029},                                            //
    {N(DEVICEIDENTIFIER), 50030},                                  //
    {N(_SERVERSEND), 50031},                                       //
    {N(_ALLOCROLE), 50032},                                        //
    {N(NOTIMPLEMENTED), 50033},                                    //
    {N(_TWINMESSAGE), 50034},                                      //
    {N(_I2CTRANSACTION), 50035},                                   //
    {N(LEDSTRIPSEND), 50036},                                      //
    {N(SPICONFIGURE), 50037},                                      //
    {N(SPIXFER), 50038},                                           //
    {N(SPISENDIMAGE), 50039},                                      //
    {N(SUSPEND), 50050},                                           //
    {N(_SOCKETOPEN), 50136},                                       //
    {N(_SOCKETCLOSE), 50137},                                      //
    {N(_SOCKETWRITE), 50138},                                      //
    {0, 0}};

static const devs_builtin_proto_entry_t TypeError_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50042},                                              //
    {0, 0}};

static const devs_builtin_proto_entry_t RangeError_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50041},                                               //
    {0, 0}};

static const devs_builtin_proto_entry_t Error_entries[] = { //
    {N(__FUNC__), 50040},                                   //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_ERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Error_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50040},                                          //
    {N(NAME), 50044},                                                 //
    {N(PRINT), 50045},                                                //
    {0, 0}};

static const devs_builtin_proto_entry_t RangeError_entries[] = { //
    {N(__FUNC__), 50041},                                        //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_RANGEERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t TypeError_entries[] = { //
    {N(__FUNC__), 50042},                                       //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_TYPEERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t SyntaxError_entries[] = { //
    {N(__FUNC__), 50043},                                         //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_SYNTAXERROR_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t SyntaxError_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50043},                                                //
    {0, 0}};

static const devs_builtin_proto_entry_t DsFiber_prototype_entries[] = { //
    {N(ID), 50046},                                                     //
    {N(SUSPENDED), 50047},                                              //
    {N(RESUME), 50048},                                                 //
    {N(TERMINATE), 50049},                                              //
    {0, 0}};

static const devs_builtin_proto_entry_t DsFiber_entries[] = { //
    {N(SELF), 50051},                                         //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_DSFIBER_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Function_prototype_entries[] = { //
    {N(START), 50052},                                                   //
    {N(PROTOTYPE), 50053},                                               //
    {N(NAME), 50054},                                                    //
    {0, 0}};

static const devs_builtin_proto_entry_t GPIO_prototype_entries[] = { //
    {N(MODE), 50055},                                                //
    {N(CAPABILITIES), 50056},                                        //
    {N(VALUE), 50057},                                               //
    {N(SETMODE), 50058},                                             //
    {0, 0}};

static const devs_builtin_proto_entry_t Image_prototype_entries[] = { //
    {N(WIDTH), 50059},                                                //
    {N(HEIGHT), 50060},                                               //
    {N(BPP), 50061},                                                  //
    {N(BUFFER), 50062},                                               //
    {N(SET), 50064},                                                  //
    {N(GET), 50065},                                                  //
    {N(FILL), 50066},                                                 //
    {N(FILLRECT), 50067},                                             //
    {N(EQUALS), 50068},                                               //
    {N(CLONE), 50069},                                                //
    {N(FLIPX), 50070},                                                //
    {N(FLIPY), 50071},                                                //
    {N(TRANSPOSED), 50072},                                           //
    {N(DRAWIMAGE), 50073},                                            //
    {N(DRAWTRANSPARENTIMAGE), 50074},                                 //
    {N(OVERLAPSWITH), 50075},                                         //
    {N(DRAWLINE), 50076},                                             //
    {N(BLITROW), 50077},                                              //
    {N(BLIT), 50078},                                                 //
    {N(FILLCIRCLE), 50079},                                           //
    {0, 0}};

static const devs_builtin_proto_entry_t Image_entries[] = { //
    {N(ALLOC), 50063},                                      //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_IMAGE_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t JSON_entries[] = { //
    {N(PARSE), 50080},                                     //
    {N(STRINGIFY), 50081},                                 //
    {0, 0}};

static const devs_builtin_proto_entry_t Math_entries[] = { //
    {N(CEIL), 50082},                                      //
    {N(FLOOR), 50083},                                     //
    {N(ROUND), 50084},                                     //
    {N(ABS), 50085},                                       //
    {N(RANDOM), 50086},                                    //
    {N(RANDOMINT), 50087},                                 //
    {N(LOG), 50088},                                       //
    {N(POW), 50089},                                       //
    {N(IDIV), 50090},                                      //
    {N(IMOD), 50091},                                      //
    {N(IMUL), 50092},                                      //
    {N(MIN), 50093},                                       //
    {N(MAX), 50094},                                       //
    {0, 0}};

static const devs_builtin_proto_entry_t Object_entries[] = { //
    {N(ASSIGN), 50095},                                      //
    {N(KEYS), 50096},                                        //
    {N(VALUES), 50097},                                      //
    {N(SETPROTOTYPEOF), 50098},                              //
    {N(__FUNC__), 50099},                                    //
    {N(PROTOTYPE), DEVS_BUILTIN_OBJECT_OBJECT_PROTOTYPE},    //
    {0, 0}};

static const devs_builtin_proto_entry_t Object_prototype_entries[] = { //
    {N(CONSTRUCTOR), 50099},                                           //
    {0, 0}};

static const devs_builtin_proto_entry_t DsPacket_prototype_entries[] = { //
    {N(ROLE), 50100},                                                    //
    {N(DEVICEIDENTIFIER), 50101},                                        //
    {N(SHORTID), 50102},                                                 //
    {N(SERVICEINDEX), 50103},                                            //
    {N(SERVICECOMMAND), 50104},                                          //
    {N(FLAGS), 50105},                                                   //
    {N(ISCOMMAND), 50106},                                               //
    {N(ISREPORT), 50107},                                                //
    {N(PAYLOAD), 50108},                                                 //
    {N(ISEVENT), 50109},                                                 //
    {N(EVENTCODE), 50110},                                               //
    {N(ISREGSET), 50111},                                                //
    {N(ISREGGET), 50112},                                                //
    {N(REGCODE), 50113},                                                 //
    {N(ISACTION), 50114},                                                //
    {N(SPEC), 50115},                                                    //
    {N(DECODE), 50116},                                                  //
    {N(NOTIMPLEMENTED), 50117},                                          //
    {0, 0}};

static const devs_builtin_proto_entry_t DsPacketSpec_prototype_entries[] = { //
    {N(PARENT), 50118},                                                      //
    {N(NAME), 50119},                                                        //
    {N(CODE), 50120},                                                        //
    {N(RESPONSE), 50121},                                                    //
    {N(ENCODE), 50122},                                                      //
    {0, 0}};

static const devs_builtin_proto_entry_t DsRegister_prototype_entries[] = { //
    {N(READ), 50123},                                                      //
    {N(WRITE), 50124},                                                     //
    {0, 0}};

static const devs_builtin_proto_entry_t DsCommand_prototype_entries[] = { //
    {N(__FUNC__), 50128},                                                 //
    {0, 0}};

static const devs_builtin_proto_entry_t DsEvent_prototype_entries[] = { //
    {0, 0}};

static const devs_builtin_proto_entry_t DsPacketInfo_prototype_entries[] = { //
    {N(ROLE), 50125},                                                        //
    {N(NAME), 50126},                                                        //
    {N(CODE), 50127},                                                        //
    {0, 0}};

static const devs_builtin_proto_entry_t DsRole_prototype_entries[] = { //
    {N(ISBOUND), 50129},                                               //
    {N(SPEC), 50130},                                                  //
    {N(SENDCOMMAND), 50131},                                           //
    {0, 0}};

static const devs_builtin_proto_entry_t DsServiceSpec_prototype_entries[] = { //
    {N(CLASSIDENTIFIER), 50132},                                              //
    {N(NAME), 50133},                                                         //
    {N(LOOKUP), 50134},                                                       //
    {N(ASSIGN), 50135},                                                       //
    {0, 0}};

static const devs_builtin_proto_entry_t String_prototype_entries[] = { //
    {N(LENGTH), 50139},                                                //
    {N(BYTELENGTH), 50140},                                            //
    {N(CHARCODEAT), 50141},                                            //
    {N(CHARAT), 50142},                                                //
    {N(SLICE), 50143},                                                 //
    {N(INDEXOF), 50145},                                               //
    {N(TOLOWERCASE), 50146},                                           //
    {N(TOUPPERCASE), 50147},                                           //
    {0, 0}};

static const devs_builtin_proto_entry_t String_entries[] = { //
    {N(FROMCHARCODE), 50144},                                //
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
    [DEVS_BUILTIN_OBJECT_OBJECT_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL,
                                              Object_prototype_entries},
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
    [DEVS_BUILTIN_OBJECT_NUMBER_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
    [DEVS_BUILTIN_OBJECT_BOOLEAN_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
    [DEVS_BUILTIN_OBJECT_DSREPORT_PROTOTYPE] = {DEVS_BUILTIN_PROTO_INIT, NULL, empty_entries},
};

uint16_t devs_num_builtin_functions = 148;
const devs_builtin_function_t devs_builtin_functions[148] = {
    {N(LENGTH), 0, PROP, {.prop = prop_Array_length}},
    {N(INSERT), 2, 0, {.meth = meth2_Array_insert}},
    {N(ISARRAY), 1, NO_SELF, {.meth = fun1_Array_isArray}},
    {N(ARRAY), 0, CTOR, {.meth = methX_Array___ctor__}},
    {N(PUSH), 0, 0, {.meth = methX_Array_push}},
    {N(PUSHRANGE), 1, 0, {.meth = meth1_Array_pushRange}},
    {N(SLICE), 0, 0, {.meth = methX_Array_slice}},
    {N(JOIN), 1, 0, {.meth = meth1_Array_join}},
    {N(ALLOC), 1, NO_SELF, {.meth = fun1_Buffer_alloc}},
    {N(FROM), 2, NO_SELF, {.meth = fun2_Buffer_from}},
    {N(LENGTH), 0, PROP, {.prop = prop_Buffer_length}},
    {N(TOSTRING), 1, 0, {.meth = meth1_Buffer_toString}},
    {N(FILLAT), 3, 0, {.meth = meth3_Buffer_fillAt}},
    {N(BLITAT), 4, 0, {.meth = meth4_Buffer_blitAt}},
    {N(INDEXOF), 3, 0, {.meth = meth3_Buffer_indexOf}},
    {N(FILLRANDOM), 0, 0, {.meth = meth0_Buffer_fillRandom}},
    {N(ENCRYPT), 4, 0, {.meth = meth4_Buffer_encrypt}},
    {N(DIGEST), 3, NO_SELF, {.meth = fun3_Buffer_digest}},
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
    {N(LEDSTRIPSEND), 2, NO_SELF, {.meth = fun2_DeviceScript_ledStripSend}},
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
    {N(OBJECT), 1, CTOR, {.meth = meth1_Object___ctor__}},
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
